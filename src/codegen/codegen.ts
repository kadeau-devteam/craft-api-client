import type { CodegenConfig } from '@graphql-codegen/cli';
import path from 'path';

const config: CodegenConfig = {
  schema: path.resolve(__dirname, '../schema.graphql'),
  documents: [
    path.resolve(__dirname, '../graphql/ping.graphql'),
    path.resolve(__dirname, '../graphql/getEntry.graphql'),
    path.resolve(__dirname, '../graphql/getEntries.graphql'),
  ],
  generates: {
    [path.resolve(__dirname, '../generated/client.ts')]: {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-graphql-request',
      ],
      config: {
        rawRequest: false,
      },
    },
  },
};

export default config;
