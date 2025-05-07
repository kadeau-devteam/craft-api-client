# Craft API Client

A TypeScript client library for interacting with the Craft API.

## Installation

```bash
pnpm add craft-api-client
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
import craftClient, { gql } from 'craft-api-client';

// Create a client instance
const client = craftClient({
  apiKey: 'your-craft-api-key',
  baseUrl: 'https://your-craft-site.com/api'
});

// Check if the API is available
const pingResult = await client.ping();
console.log(pingResult); // 'pong'
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

## Features

- Modern ESM package
- Full TypeScript support
- Tree-shakeable
- Built with tsup for efficient bundling
- Custom query generation with type safety
- Strongly typed GraphQL queries using GraphQL Code Generator
- Built on graphql-request for efficient API communication
- Generated SDK for type-safe API interactions
- Comprehensive test coverage

## Requirements

- Node.js >= 20.10.0

## Development

```bash
# Install dependencies
pnpm install

# Generate GraphQL types and SDK
pnpm codegen

# Run all tests (unit and integration)
pnpm test:all

# Run only unit tests
pnpm test:unit

# Run only integration tests
pnpm test:integration

# Run tests in watch mode (during development)
pnpm test

# Build the project
pnpm build
```

## License

ISC
