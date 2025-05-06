import type { CodegenConfig } from '@graphql-codegen/cli';

// Function to get custom document paths from environment variable or default to empty array
function getCustomDocumentPaths(): string[] {
  const customPathsEnv = process.env.CRAFT_API_CLIENT_CUSTOM_DOCUMENTS;
  if (!customPathsEnv) return [];

  return customPathsEnv.split(',').map(p => p.trim());
}

// Get all document paths (built-in + custom)
const documentPaths = ['./src/graphql/**/*.graphql', ...getCustomDocumentPaths()];

const config: CodegenConfig = {
  schema: './src/schema.graphql', // Path to your GraphQL schema
  documents: documentPaths, // Path to your GraphQL operations
  generates: {
    './src/generated/': {
      preset: 'client',
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-graphql-request',
      ],
      config: {
        rawRequest: true,
        skipTypename: false,
        dedupeFragments: true,
        exportFragmentSpreadSubTypes: true,
        documentMode: 'documentNode',
      },
    },
  },
};

export default config;
