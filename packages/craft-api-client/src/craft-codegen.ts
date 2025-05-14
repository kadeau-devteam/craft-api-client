#!/usr/bin/env node

import {join, resolve} from 'path';
import {existsSync, mkdirSync} from 'fs';
import {execSync} from 'child_process';
import {lilconfig} from 'lilconfig';
import dotenv from 'dotenv';
import type {CodegenConfig} from '@graphql-codegen/cli';
import {generate} from '@graphql-codegen/cli';

// Configuration type
export interface CraftCodegenConfig {
  // Required fields
  schema: string;
  apiKey: string;

  // Optional fields
  documents?: string | string[];
  output?: string;
}

/**
 * Define a configuration for Craft API Client codegen
 * @param config The configuration object
 * @returns The validated configuration object
 */
export function defineConfig(config: CraftCodegenConfig): CraftCodegenConfig {
  // Validate required fields
  if (!config.schema) {
    throw new Error('schema is required in craft.config.ts');
  }

  if (!config.apiKey) {
    throw new Error('apiKey is required in craft.config.ts');
  }

  return config;
}


// Default export for testing
export default main;

// Load environment variables from .env files
function loadEnvVariables() {
  const envFiles = ['.env', '.env.local'];
  for (const file of envFiles) {
    const envPath = resolve(process.cwd(), file);
    if (existsSync(envPath)) {
      dotenv.config({ path: envPath });
    }
  }
}

// Check if user has provided a full override config
function checkForOverrideConfig() {
  // Check for --config argument
  const configArgIndex = process.argv.findIndex(arg => arg === '--config');
  if (configArgIndex !== -1 && configArgIndex < process.argv.length - 1) {
    return process.argv[configArgIndex + 1];
  }

  // Check for standard codegen config files
  const standardConfigFiles = ['codegen.ts', 'codegen.js', 'codegen.yml', 'codegen.yaml', 'codegen.json'];
  for (const file of standardConfigFiles) {
    const configPath = resolve(process.cwd(), file);
    if (existsSync(configPath)) {
      return configPath;
    }
  }

  return null;
}

// Load configuration from craft.config.ts
async function loadCraftConfig() {
  const explorer = lilconfig('craft', {
    searchPlaces: ['craft.config.ts', 'craft.config.js'],
    loaders: {
      '.ts': (filepath) => {
        // Dynamically import TypeScript files
        try {
          // For ESM projects, we need to use dynamic import
          return import(filepath).then(module => module.default || module);
        } catch (error) {
          console.error(`Error loading TypeScript config file: ${filepath}`, error);
          return {};
        }
      }
    }
  });

  const result = await explorer.search();
  // Return the config, which could be a raw object or the result of defineConfig
  return result?.config || {};
}

// Main function
async function main() {
  // Load environment variables
  loadEnvVariables();

  // Check for override config
  const overrideConfigPath = checkForOverrideConfig();
  if (overrideConfigPath) {
    console.log(`Using override config from ${overrideConfigPath}`);
    // Pass all arguments to graphql-codegen
    const args = process.argv.slice(2).join(' ');
    try {
      execSync(`npx graphql-codegen ${args}`, { stdio: 'inherit' });
    } catch (error) {
      process.exit(1);
    }
    return;
  }

  // Load configuration from craft.config.ts
  const craftConfig = await loadCraftConfig();

  // Get configuration values with fallbacks
  const schema = craftConfig.schema || process.env.CRAFT_GRAPHQL_SCHEMA;
  const apiKey = craftConfig.apiKey || process.env.CRAFT_API_KEY;
  const documents = craftConfig.documents || [
    'src/**/*.{ts,tsx,js,jsx,graphql,astro}',
    'app/**/*.{ts,tsx,js,jsx,graphql,astro}',
    '!**/node_modules/**'
  ];
  const output = craftConfig.output || './src/generated/craft-api/';

  // Validate required configuration
  if (!schema) {
    console.error('Error: schema is required in craft.config.ts or as CRAFT_GRAPHQL_SCHEMA environment variable');
    process.exit(1);
  }

  if (!apiKey) {
    console.error('Error: apiKey is required in craft.config.ts or as CRAFT_API_KEY environment variable');
    process.exit(1);
  }

  // Prepare headers for schema introspection
  const headers: Record<string, string> = {};
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  // Create output directory if it doesn't exist
  try {
    // Use the already imported fs module
    mkdirSync(resolve(process.cwd(), output), { recursive: true });
  } catch (error) {
    // Ignore if directory already exists
  }

  // Prepare codegen config
  const codegenConfig: CodegenConfig = {
    generates: {
      // Step 1: Generate a local schema file
      [join(output, 'schema.graphql')]: {
        schema: {
          [schema]: {
            headers
          }
        },
        plugins: ['schema-ast'],
      },
      // Step 2: Generate TypeScript types
      [output]: {
        schema: join(output, 'schema.graphql'),
        documents,
        preset: 'client',
        plugins: [],
        config: {
          skipTypename: false,
          dedupeFragments: true,
          exportFragmentSpreadSubTypes: true,
        },
      },
    },
  };

  // Run codegen
  try {
    console.log('Generating GraphQL types...');
    await generate(codegenConfig, true);
    console.log('GraphQL types generated successfully!');
  } catch (error) {
    console.error('Error generating GraphQL types:', error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
