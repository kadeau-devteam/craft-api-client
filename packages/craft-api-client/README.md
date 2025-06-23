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

## Using a Custom GraphQL SDK

You can attach a custom GraphQL SDK to the client, which allows you to use typed operations with the client.

### Basic Usage

1. Create your GraphQL SDK using a tool like [GraphQL Code Generator](https://the-guild.dev/graphql/codegen) or any other method.

2. Attach the SDK to the client when creating it:

```typescript
import { createCraftClient } from 'craft-api-client';
import { GraphQLClient } from 'graphql-request';
import { getSdk } from './graphql/sdk';

// Create a client instance with SDK
const client = createCraftClient({
  apiKey: 'your-craft-api-key',
  baseUrl: 'https://your-craft-site.com/api',
  sdk: getSdk(new GraphQLClient('https://your-craft-site.com/api', {
    headers: {
      Authorization: `Bearer your-craft-api-key`,
    },
  }))
});

// Now you can use the SDK methods directly through the client
const result = await client.sdk.getEntries();
```

### Using with Next.js

Here's an example of how to use the client with a custom SDK in a Next.js application:

```typescript
import { GraphQLClient } from 'graphql-request';
import { getSdk } from './graphql/sdk';
import { createCraftClient } from 'craft-api-client';
import { cookies, draftMode } from 'next/headers';

/**
 * Creates and returns a GraphQL client for the Craft CMS API
 * with support for draft mode and authentication.
 */
export async function getCraftClient() {
  const cookiesStore = await cookies();
  const { isEnabled } = await draftMode();
  const token = cookiesStore.get('token')?.value;

  // Base headers
  const headers: Record<string, string> = {
    Authorization: `Bearer ${process.env.CRAFT_API_KEY}`,
    'Content-Type': 'application/json',
  };

  // Conditionally add X-Craft-Token if draft mode is enabled and token exists
  if (isEnabled && token) {
    headers['X-Craft-Token'] = token;
  }

  const graphqlClient = new GraphQLClient(process.env.CRAFT_API_URL || '', { headers });

  const client = createCraftClient({
    apiKey: process.env.CRAFT_API_KEY || '',
    baseUrl: process.env.CRAFT_API_URL || '',
    previewToken: isEnabled && token ? token : undefined,
    sdk: getSdk(graphqlClient)
  });

  return client;
}

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build the package
pnpm build
```

### Building the Package

The package uses [tsup](https://github.com/egoist/tsup) for building. The build configuration is defined in `tsup.config.ts`. The build process includes both the main module (`index.ts`) and the preview module (`preview.ts`).

If you modify the build command in `package.json`, make sure it doesn't override the entry points specified in `tsup.config.ts`. The correct build command should be:

```bash
pnpm run build
```

This will ensure that both modules are built correctly and can be imported in consuming applications.

## License

ISC
