import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './src/schema.graphql',
  documents: "./src/graphql/**/*.graphql",
  generates: {
    './src/generated/': {
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