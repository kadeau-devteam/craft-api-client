# Craft API Monorepo

This monorepo contains the Craft API Client and a Next.js application that demonstrates its usage.

## Project Structure

```
craft-api-monorepo/
├── apps/
│   └── web/                 # Next.js application
├── packages/
│   └── craft-api-client/    # Craft API Client library
├── package.json             # Root package.json
├── pnpm-workspace.yaml      # PNPM workspace configuration
└── turbo.json               # Turborepo configuration
```

## Getting Started

### Prerequisites

- Node.js >= 20.10.0
- PNPM >= 10.5.2

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Build all packages
pnpm build

# Start development servers
pnpm dev

# Run tests
pnpm test

# Lint code
pnpm lint

# Clean build artifacts
pnpm clean
```

## Packages

### craft-api-client

A lean TypeScript client library for interacting with the Craft CMS API. It provides the API connection tools (`createCraftClient`, `gql`) and supports automatic type generation for GraphQL queries.

#### Installation (when published)

```bash
pnpm add craft-api-client
```

#### Features

- **Simple Client Creation**: Create a client with minimal configuration
- **Preview Support**: Enable preview mode with a preview token
- **GraphQL Query Support**: Support for .graphql files with the `gql` tag
- **Type-Safe Methods**: Generate type-safe methods for GraphQL queries
- **Codegen Integration**: Built-in support for GraphQL Code Generator
- **Dedicated Preview Module**: Specialized functions for preview mode

#### Basic Usage

```typescript
import { createCraftClient, gql } from 'craft-api-client';

// Create a client
const client = createCraftClient({
  apiKey: process.env.CRAFT_API_KEY || '',
  baseUrl: process.env.CRAFT_API_URL || '',
  previewToken: process.env.CRAFT_PREVIEW_TOKEN // Optional
});

// Use the client with a GraphQL query
const result = await client.query(gql`
  query GetEntries {
    entries {
      id
      title
    }
  }
`);

// Or use with an imported .graphql file
import myQuery from './path/to/query.graphql';
const typedResult = await client.query(myQuery);
```

#### Preview Mode

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

#### Setting Up Codegen

The package includes a template for setting up GraphQL Code Generator in your application:

1. Create a `codegen.ts` file in your application (or copy from the template)
2. Configure it to point to your Craft CMS GraphQL API
3. Add a script to run codegen before building

Example `codegen.ts`:

```typescript
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: {
    [process.env.CRAFT_GRAPHQL_SCHEMA || '']: {
      headers: {
        Authorization: `Bearer ${process.env.CRAFT_API_KEY || ''}`,
      },
    },
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
    },
  },
};

export default config;
```

Add to your `package.json`:

```json
{
  "scripts": {
    "codegen": "graphql-codegen --config codegen.ts",
    "prebuild": "pnpm run codegen"
  }
}
```

### web (Next.js App)

A Next.js application that demonstrates the usage of the craft-api-client. It is responsible for:

1. Generating TypeScript types for the specific Craft CMS instance it communicates with
2. Processing local GraphQL query files
3. Generating typed document nodes for these operations

#### Environment Variables

The Next.js application requires the following environment variables:

```
CRAFT_API_KEY=your-craft-api-key
CRAFT_API_URL=https://your-craft-cms-url/api
CRAFT_GRAPHQL_SCHEMA=https://your-craft-cms-url/actions/graphql/api
CRAFT_PREVIEW_TOKEN=your-preview-token  # Optional, for preview mode
```

Copy the `.env.example` file to `.env.local` in the `apps/web` directory and update the values.

#### Running the Next.js App

```bash
# From the root of the monorepo
pnpm dev

# Or specifically for the web app
cd apps/web
pnpm dev
```

### Next.js Configuration

If you're using this library in a Next.js project, you'll need to configure Next.js to handle GraphQL files.

#### Using webpack (default)

Add the following to your `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Add a rule for .graphql files
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'graphql-tag/loader'
        }
      ]
    });

    return config;
  }
};

module.exports = nextConfig;
```

You'll also need to install the graphql-tag loader:

```bash
pnpm add -D graphql-tag
```

#### Using Turbopack

If you're using Turbopack, you'll need to configure it differently. Add the following to your `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        // Configure Turbopack to handle .graphql files
        '*.graphql': {
          loaders: ['graphql-tag/loader'],
          as: 'document',
        },
        '*.gql': {
          loaders: ['graphql-tag/loader'],
          as: 'document',
        },
      },
    },
  },
};

module.exports = nextConfig;
```

You'll still need to install the graphql-tag loader:

```bash
pnpm add -D graphql-tag
```

## Usage

```typescript
import { craftClient, gql } from 'craft-api-client';

// Create a client instance
const client = craftClient({
  apiKey: 'your-craft-api-key',
  baseUrl: 'https://your-craft-site.com/api'
});

// Execute a simple query
const result = await client.query(gql`
  query {
    entries {
      id
      title
    }
  }
`);
```

### Using GraphQL Files

You can import GraphQL queries from separate files and use them directly with the client:

```typescript
// Import a GraphQL query from a file
import destinationsQuery from './queries/destinations.graphql';

// Use it with the client
const destinations = await client.query(destinationsQuery);

// You can also use the gql tag for inline queries
import { gql } from 'craft-api-client';

const inlineQuery = gql`
  query {
    entries {
      id
      title
    }
  }
`;

const entries = await client.query(inlineQuery);
```

This approach helps organize your GraphQL queries in separate files, making your code more maintainable.

### Type-Safe Queries

#### Manual Type Definitions

You can get typed results from your queries by providing a type parameter to the `query` method:

```typescript
// Define your query type
type DestinationsQuery = {
  destinationsEntries: Array<{
    id: string;
    title: string;
  }>;
};

// Use the query with type parameter
const result = await client.query<DestinationsQuery>(gql`
  query Destinations {
    destinationsEntries {
      ... on destination_Entry {
        id
        title
      }
    }
  }
`);

// Now result is typed as DestinationsQuery
console.log(result.destinationsEntries[0].title); // TypeScript knows this is a string
```

#### Using Generated Types (in the web app)

After running code generation in the web app, you can use the generated types for fully type-safe queries:

```typescript
import { craftClient } from 'craft-api-client';
import { TestPageQueryDocument, TestPageQueryQuery, TestPageQueryQueryVariables } from '../generated/graphql';

// Create a client
const client = craftClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://your-craft-cms-url/api'
});

// Execute a query with typed results and variables
const result = await client.query<TestPageQueryQuery, TestPageQueryQueryVariables>(
  TestPageQueryDocument,
  { section: ["pages"] }
);

// Now result is fully typed based on your GraphQL schema
console.log(result.entry?.uid); // TypeScript knows the exact structure
```

This provides full type safety and autocompletion for your query results based on your specific Craft CMS schema.

## Features

### craft-api-client Package
- Modern ESM package
- Full TypeScript support
- Tree-shakeable
- Built with tsup for efficient bundling
- Lean implementation focused on API connection
- Built on graphql-request for efficient API communication
- Comprehensive test coverage

### Web Application
- Full schema introspection of Craft CMS GraphQL API
- Strongly typed GraphQL queries using GraphQL Code Generator
- Generated TypeScript types for all CMS-specific entities
- Typed document nodes for operations
- Type-safe API interactions

## Requirements

- Node.js >= 20.10.0

## Development

```bash
# Install dependencies
pnpm install

# Build the craft-api-client package
pnpm --filter craft-api-client build

# Generate GraphQL types in the web app
pnpm --filter web codegen

# Run tests for the craft-api-client package
pnpm --filter craft-api-client test

# Run the web app in development mode
pnpm --filter web dev

# Build all packages
pnpm build
```

## License

ISC
