import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: process.env.CRAFT_API_URL ?? './src/schema.graphql',
  documents: './src/queries/**/*.graphql',
  generates: {
    './src/generated/client.ts': {
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
