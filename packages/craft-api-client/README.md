# Craft API Client

A TypeScript client library for interacting with the Craft CMS API.

This package is part of the [Craft API Monorepo](../../README.md).

## Installation

```bash
pnpm add craft-api-client
```

## Usage

### Basic Usage

```typescript
import { createCraftClient, gql } from 'craft-api-client';

// Create a client instance
const client = createCraftClient({
  apiKey: 'your-craft-api-key',
  baseUrl: 'https://your-craft-site.com/api'
});

// Execute a GraphQL query
const result = await client.query(gql`
  query GetEntries {
    entries {
      id
      title
    }
  }
`);
```

### Importing GraphQL Files

The package includes TypeScript declarations for importing `.graphql` files directly:

```typescript
// Import a GraphQL query from a file
import myQueryDocument from './queries/myQuery.graphql';

// Use it with the client
const result = await client.query(myQueryDocument);
```

To use this feature in your project, you need to:

1. Make sure your TypeScript configuration includes the declaration file:

```json
// tsconfig.json
{
  "include": [
    // ... other includes
    "node_modules/craft-api-client/dist/**/*.d.ts",
    // Or create your own declaration file in your project:
    "src/graphql.d.ts"
  ]
}
```

2. If you create your own declaration file, it should contain:

```typescript
// src/graphql.d.ts
declare module '*.graphql' {
  import { DocumentNode } from 'graphql';
  const content: DocumentNode;
  export default content;
}
```

This allows TypeScript to recognize imports of `.graphql` files as `DocumentNode` objects.

### Preview Mode

The package includes a dedicated module for working with preview mode:

```typescript
import { createPreviewClient, isPreviewMode } from 'craft-api-client/preview';

// Create a client with preview mode enabled
const previewClient = createPreviewClient({
  apiKey: process.env.CRAFT_API_KEY || '',
  baseUrl: process.env.CRAFT_API_URL || '',
}, process.env.CRAFT_PREVIEW_TOKEN);

// Check if a client is in preview mode
if (isPreviewMode(previewClient)) {
  console.log('Preview mode is enabled');
}

// Use the preview client just like a regular client
const result = await previewClient.query(gql`
  query GetEntries {
    entries {
      id
      title
    }
  }
`);
```

For more detailed usage instructions, see the [main README](../../README.md).

## GraphQL Code Generation

The package includes a CLI tool for generating GraphQL types and utilities based on your schema.

### Basic Usage

1. Install the necessary peer dependencies:

```bash
pnpm add -D graphql @graphql-codegen/cli @graphql-codegen/client-preset @graphql-codegen/schema-ast
```

2. Add a script to your package.json:

```json
{
  "scripts": {
    "codegen": "craft-codegen"
  }
}
```

3. Create a `craft.config.ts` file in your project root:

```typescript
export default {
  // The URL or local file path to the GraphQL schema (mandatory)
  schema: 'https://your-craft-site.com/api/graphql',

  // API key for authentication (optional)
  apiKey: 'your-api-key',

  // Glob pattern(s) for your GraphQL documents (optional)
  documents: [
    'src/**/*.{ts,tsx,js,jsx,graphql,astro}',
    'app/**/*.{ts,tsx,js,jsx,graphql,astro}',
    '!**/node_modules/**'
  ],

  // The output directory for generated files (optional)
  output: './src/generated/craft-api/',
};
```

4. Run the codegen command:

```bash
pnpm codegen
```

### Configuration

The `craft-codegen` script prioritizes loading configuration from `craft.config.ts` in your project root. You can also use environment variables as an alternative or override for values not found in `craft.config.ts`.

#### Environment Variables

- `CRAFT_GRAPHQL_SCHEMA`: The URL or local file path to the GraphQL schema
- `CRAFT_API_KEY`: An API key to be used in the "Authorization: Bearer <apiKey>" header

#### Advanced Usage

If you need more control over the code generation process, you can create your own `codegen.ts` file or use the `--config` flag to specify a custom configuration file.

## Development

```bash
# Install dependencies
pnpm install

# Generate GraphQL types and SDK
pnpm codegen

# Run tests
pnpm test

# Build the package
pnpm build
```

### Building the Package

The package uses [tsup](https://github.com/egoist/tsup) for building. The build configuration is defined in `tsup.config.ts`. The build process includes both the main module (`index.ts`) and the preview module (`preview.ts`).

If you modify the build command in `package.json`, make sure it doesn't override the entry points specified in `tsup.config.ts`. The correct build command should be:

```bash
pnpm run codegen && tsup
```

This will ensure that both modules are built correctly and can be imported in consuming applications.

## License

ISC
