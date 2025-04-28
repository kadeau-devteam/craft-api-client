# Craft API Client

A TypeScript client library for interacting with the Craft API.

## Installation

```bash
pnpm add craft-api-client
```

## Usage

```typescript
import createCraftClient from 'craft-api-client';

// Create a client instance
const client = createCraftClient({
  apiKey: 'your-craft-api-key',
  baseUrl: 'https://your-craft-site.com/api'
});

// Check if the API is available
const pingResult = await client.ping();
console.log(pingResult); // 'pong'

// Fetch entries from a specific section
const entries = await client.getEntries({
  section: 'news',
  limit: 10,
  orderBy: 'postDate DESC'
});

// Fetch a specific entry by ID
const entry = await client.getEntry('123');

// Make a custom GraphQL query
const result = await client.query({
  query: `
    query GetAuthor($id: ID!) {
      author(id: $id) {
        id
        name
        bio
      }
    }
  `,
  variables: {
    id: '456'
  }
});
```

## Features

- Modern ESM package
- Full TypeScript support
- Tree-shakeable
- Comprehensive test coverage

## Requirements

- Node.js >= 20.10.0

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build the project
pnpm build
```

## License

ISC
