import type { CodegenConfig } from '@graphql-codegen/cli';
import dotenv from 'dotenv';

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
