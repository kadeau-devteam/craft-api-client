import type { CodegenConfig } from '@graphql-codegen/cli';
import * as fs from 'fs';
import * as path from 'path';

// Function to detect if we're in a monorepo or standalone package
function isMonorepo(): boolean {
  try {
    // Check if we're in a monorepo by looking for a pnpm-workspace.yaml file
    return fs.existsSync(path.resolve(__dirname, '../../pnpm-workspace.yaml'));
  } catch (error) {
    return false;
  }
}

// Function to get the schema URL from environment variables or fallback to a local file
function getSchemaSource(): string | Record<string, any> {
  // Try to get the schema URL from environment variables
  const schemaUrl = process.env.CRAFT_GRAPHQL_SCHEMA;
  
  if (schemaUrl) {
    const headers: Record<string, string> = {};
    
    // Add authorization header if API key is available
    if (process.env.CRAFT_API_KEY) {
      headers['Authorization'] = `Bearer ${process.env.CRAFT_API_KEY}`;
    }
    
    // Return the schema URL with headers
    return {
      [schemaUrl]: {
        headers,
      },
    };
  }
  
  // Fallback to local schema file
  const localSchemaPath = path.resolve(__dirname, './src/schema.graphql');
  if (fs.existsSync(localSchemaPath)) {
    return localSchemaPath;
  }
  
  throw new Error('No schema source found. Please provide CRAFT_GRAPHQL_SCHEMA environment variable or a local schema.graphql file.');
}

// Function to get the documents path based on whether we're in a monorepo or standalone package
function getDocumentsPath(): string {
  if (isMonorepo()) {
    // In a monorepo, look for .graphql files in the apps directory
    return '../../apps/**/src/graphql/**/*.graphql';
  }
  
  // In a standalone package, look for .graphql files in the src directory
  return './src/graphql/**/*.graphql';
}

const config: CodegenConfig = {
  schema: getSchemaSource(),
  documents: getDocumentsPath(),
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