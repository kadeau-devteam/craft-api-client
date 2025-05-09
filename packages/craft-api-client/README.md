# Craft API Client

A TypeScript client library for interacting with the Craft CMS API.

This package is part of the [Craft API Monorepo](../../README.md).

## Installation

```bash
pnpm add craft-api-client
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

## License

ISC