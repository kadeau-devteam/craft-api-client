import type { CodegenConfig } from '@graphql-codegen/cli';
import { join } from 'path';

/**
 * This is a template for the codegen configuration that can be used by apps
 * that use the craft-api-client package.
 * 
 * Usage:
 * 1. Copy this file to your app's src/codegen directory
 * 2. Rename it to codegen.ts
 * 3. Customize the configuration as needed
 */

const config: CodegenConfig = {
  schema: {
    // Replace with your Craft CMS GraphQL API URL
    [process.env.CRAFT_GRAPHQL_SCHEMA || 'https://your-craft-cms-url/actions/graphql/api']: {
      headers: {
        // Use the API key from environment variables
        Authorization: `Bearer ${process.env.CRAFT_API_KEY || ''}`,
      },
    },
  },
  // Path to your GraphQL queries
  documents: './src/graphql/**/*.graphql',
  generates: {
    // Output directory for generated files
    './src/generated/graphql/': {
      preset: 'client',
      plugins: [
        'typescript',
        'typescript-operations',
        'typed-document-node',
      ],
      config: {
        skipTypename: false,
        dedupeFragments: true,
        exportFragmentSpreadSubTypes: true,
        documentMode: 'documentNode',
      },
    },
  },
};

export default config;