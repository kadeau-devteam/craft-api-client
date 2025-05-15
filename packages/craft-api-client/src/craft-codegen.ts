#!/usr/bin/env node

import {resolve} from 'path';
import {existsSync, mkdirSync, readdirSync} from 'fs';
import {execSync} from 'child_process';
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

// Flag to indicate whether we're running in a test environment
export const isTestEnvironment = () => process.env.NODE_ENV === 'test' || process.env.VITEST === 'true';

// Get the current working directory with a fallback
function getCwd() {
  try {
    const cwd = process.cwd();
    if (cwd === undefined || cwd === null) {
      return '/tmp/test-dir';
    }
    return cwd;
  } catch (error) {
    return '/tmp/test-dir';
  }
}

// Load environment variables from .env files
function loadEnvVariables() {
  // Skip loading environment variables in test environment
  if (isTestEnvironment()) {
    return;
  }

  try {
    const envFiles = ['.env', '.env.local'];
    for (const file of envFiles) {
      try {
        const cwd = getCwd();
        if (cwd) {
          const envPath = resolve(cwd, file);
          if (envPath && existsSync(envPath)) {
            dotenv.config({ path: envPath });
          }
        }
      } catch (error) {
        console.error(`Error loading environment variables from ${file}:`, error);
      }
    }
  } catch (error) {
    console.error('Error loading environment variables:', error);
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
    const configPath = resolve(getCwd(), file);
    if (existsSync(configPath)) {
      return configPath;
    }
  }

  return null;
}

// Load configuration from craft.config.ts
async function loadCraftConfig() {
  process.stdout.write('Loading craft config...\n');

  // Check if craft.config.ts exists
  const configPath = resolve(getCwd(), 'craft.config.ts');
  const configJsPath = resolve(getCwd(), 'craft.config.js');

  process.stdout.write(`Checking for config files:\n- ${configPath}\n- ${configJsPath}\n`);

  if (existsSync(configPath)) {
    process.stdout.write(`Found config file: ${configPath}\n`);
    process.stdout.write('Using environment variables instead of trying to import TypeScript file directly.\n');
  } else if (existsSync(configJsPath)) {
    process.stdout.write(`Found config file: ${configJsPath}\n`);
    process.stdout.write('Using environment variables instead of trying to import JavaScript file directly.\n');
  } else {
    process.stdout.write('No config file found. Using environment variables only.\n');
  }

  // Create a config object from environment variables
  const config = {
    schema: process.env.CRAFT_API_URL || process.env.CRAFT_GRAPHQL_SCHEMA,
    apiKey: process.env.CRAFT_API_KEY,
    documents: [
      'src/**/*.{ts,tsx,js,jsx,graphql,astro}',
      'app/**/*.{ts,tsx,js,jsx,graphql,astro}',
      '!**/node_modules/**',
      '!**/test/**/*.{ts,tsx,js,jsx,graphql,astro}',
      '!**/*.test.{ts,tsx,js,jsx,graphql,astro}'
    ],
    output: './src/generated/craft-api/'
  };

  process.stdout.write(`Created config from environment variables: ${JSON.stringify(config, null, 2)}\n`);

  return config;
}

// Main function
async function main() {
  // Force enable debug mode
  process.env.DEBUG = 'true';

  // Ensure console output is displayed
  process.stdout.write('Starting craft-codegen...\n');

  // Load environment variables
  loadEnvVariables();
  process.stdout.write(`Current working directory: ${getCwd()}\n`);

  // Check for override config
  const overrideConfigPath = checkForOverrideConfig();
  if (overrideConfigPath) {
    console.log(`Using override config from ${overrideConfigPath}`);
    // Pass all arguments to graphql-codegen
    const args = process.argv.slice(2).join(' ');
    try {
      execSync(`npx graphql-codegen ${args}`, { stdio: 'inherit' });
    } catch (error) {
      if (isTestEnvironment()) {
        throw error;
      } else {
        process.exit(1);
      }
    }
    return;
  }

  // Load configuration from craft.config.ts or environment variables
  const config = await loadCraftConfig();

  // Log environment variables for debugging
  process.stdout.write('Environment variables:\n');
  process.stdout.write(`- CRAFT_API_URL: ${process.env.CRAFT_API_URL || 'not set'}\n`);
  process.stdout.write(`- CRAFT_GRAPHQL_SCHEMA: ${process.env.CRAFT_GRAPHQL_SCHEMA || 'not set'}\n`);
  process.stdout.write(`- CRAFT_API_KEY: ${process.env.CRAFT_API_KEY ? '***' : 'not set'}\n`);

  // Use the config object directly
  const schema = config.schema;
  const apiKey = config.apiKey;
  const documents = config.documents;
  const output = config.output;

  process.stdout.write('Final configuration:\n');
  process.stdout.write(`- schema: ${schema || 'not set'}\n`);
  process.stdout.write(`- apiKey: ${apiKey ? '***' : 'not set'}\n`);
  process.stdout.write(`- documents: ${JSON.stringify(documents)}\n`);
  process.stdout.write(`- output: ${output}\n`);

  // Validate required configuration
  if (!schema) {
    const errorMessage = 'Error: schema is required in craft.config.ts or as CRAFT_API_URL or CRAFT_GRAPHQL_SCHEMA environment variable';
    console.error(errorMessage);
    if (process.env.NODE_ENV === 'test' || process.env.VITEST) {
      throw new Error(errorMessage);
    } else {
      process.exit(1);
    }
  }

  if (!apiKey) {
    const errorMessage = 'Error: apiKey is required in craft.config.ts or as CRAFT_API_KEY environment variable';
    console.error(errorMessage);
    if (process.env.NODE_ENV === 'test' || process.env.VITEST) {
      throw new Error(errorMessage);
    } else {
      process.exit(1);
    }
  }

  // Prepare headers for schema introspection
  const headers: Record<string, string> = {};
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  // Create output directory if it doesn't exist
  try {
    // Use the already imported fs module
    mkdirSync(resolve(getCwd(), output), { recursive: true });
  } catch (error) {
    // Ignore if directory already exists
  }

  // Prepare codegen config
  const codegenConfig: CodegenConfig = {
    schema: {
      [schema]: {
        headers
      }
    },
    documents,
    generates: {
      // Generate TypeScript types directly from the remote schema
      [output]: {
        preset: 'client',
        plugins: [],
        config: {
          skipTypename: false,
          dedupeFragments: true,
          exportFragmentSpreadSubTypes: true,
          documentMode: 'documentNodeImportFragments',
          // Add unique suffix to operation names to avoid conflicts
          operationResultSuffix: 'Result',
        },
        // Also generate schema.graphql file alongside the TypeScript types
        presetConfig: {
          gqlTagName: 'gql',
          fragmentMasking: false,
          useTypeImports: true
        }
      },
      // Generate schema.graphql file
      [resolve(getCwd(), output, 'schema.graphql')]: {
        schema: {
          [schema]: {
            headers
          }
        },
        plugins: ['schema-ast'],
      },
    },
  };

  // Add additional options for the generate function
  const generateOptions = {
    skipValidation: true, // Skip validation to allow duplicate operation names
  };

  // Run codegen
  try {
    process.stdout.write('Generating GraphQL types...\n');
    process.stdout.write(`Using codegen config: ${JSON.stringify(codegenConfig, null, 2)}\n`);
    process.stdout.write(`Using generate options: ${JSON.stringify(generateOptions, null, 2)}\n`);
    await generate({
      ...codegenConfig,
      ...generateOptions
    }, true);
    process.stdout.write('GraphQL types generated successfully!\n');

    // Verify the output directory was created
    const outputPath = resolve(getCwd(), output);
    process.stdout.write(`Checking if output directory exists: ${outputPath}\n`);
    if (existsSync(outputPath)) {
      process.stdout.write(`Output directory exists. Contents: ${JSON.stringify(readdirSync(outputPath))}\n`);
    } else {
      process.stdout.write(`Output directory does not exist!\n`);
    }
  } catch (error) {
    process.stdout.write(`Error generating GraphQL types: ${error}\n`);
    console.error('Error generating GraphQL types:', error);
    if (process.env.NODE_ENV === 'test' || process.env.VITEST) {
      throw error;
    } else {
      process.exit(1);
    }
  }
}

main().catch(error => {
  process.stdout.write(`Unexpected error: ${error}\n`);
  console.error('Unexpected error:', error);
  if (process.env.NODE_ENV === 'test' || process.env.VITEST) {
    throw error;
  } else {
    process.exit(1);
  }
});
