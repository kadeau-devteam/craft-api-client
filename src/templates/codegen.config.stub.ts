import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: process.env.CRAFT_API_URL!,
  documents: './cms/queries/**/*.graphql',
  generates: {
    './cms/generated/client.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-graphql-request'
      ],
      config: {
        rawRequest: false
      }
    }
  }
};

export default config;
