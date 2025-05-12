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
