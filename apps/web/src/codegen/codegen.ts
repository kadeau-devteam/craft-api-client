import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: {
    "https://mercury-sign.frb.io/actions/graphql/api": {
      headers: {
        "Authorization": "Bearer 4G6leis24EdDxmrJN7uAypEiUIDuoq7u"
      }
    }
  },
  documents: './src/graphql/**/*.graphql',
  generates: {
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