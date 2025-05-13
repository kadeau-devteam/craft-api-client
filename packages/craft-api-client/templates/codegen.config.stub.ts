import type { CodegenConfig } from '@graphql-codegen/cli';
import dotenv from 'dotenv';

/**
 * This is a template for the codegen configuration that can be used by apps
 * that use the craft-api-client package.
 * 
 * Usage:
 * 1. Copy this file to your app's src/codegen directory
 * 2. Rename it to codegen.ts
 * 3. Customize the configuration as needed
 * 
 * For Next.js apps:
 * - All necessary dependencies (graphql, codegen, dotenv, etc.) are already included with the craft-api-client package
 * - Create a .env.local file in your project root with CRAFT_API_KEY and CRAFT_GRAPHQL_SCHEMA variables
 * - Run codegen with: npx graphql-codegen -c src/codegen/codegen.ts
 */

// Load environment variables
dotenv.config({ path: process.cwd() + '/.env.local' });

const apiToken = process.env.CRAFT_API_KEY || '4G6leis24EdDxmrJN7uAypEiUIDuoq7u';
const schemaUrl = process.env.CRAFT_GRAPHQL_SCHEMA || 'https://mercury-sign.frb.io/actions/graphql/api';

const config: CodegenConfig = {
  generates: {
    // Step 1: Generate a local schema file from the remote endpoint
    './src/generated/graphql/schema.graphql': {
      schema: {
        [schemaUrl]: {
          headers: {
            "Authorization": `Bearer ${apiToken}`
          }
        }
      },
      plugins: ['schema-ast'],
    },
    // Step 2: Generate TypeScript types using the remote schema directly
    './src/generated/graphql/': {
      schema: {
        [schemaUrl]: {
          headers: {
            "Authorization": `Bearer ${apiToken}`
          }
        }
      },
      documents: './src/graphql/**/*.graphql',
      preset: 'client',
      config: {
        skipTypename: false,
        dedupeFragments: true,
        exportFragmentSpreadSubTypes: true,
      },
    },
  },
};

export default config;
