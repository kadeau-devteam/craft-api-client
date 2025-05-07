# Craft API Client

A TypeScript client library for interacting with the Craft API.

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

// Fetch entries from a specific section
const entries = await client.getEntries({
  section: ['news'],
  limit: 10,
  orderBy: 'postDate DESC'
});

// Fetch a specific entry by ID
const entry = await client.getEntry('123');

```

### Advanced Usage with the Generated SDK

The client exposes the generated SDK and GraphQL client for advanced usage:

```typescript
// Access the generated SDK directly
const authorData = await client.sdk.GetAuthor({ id: '456' });

// Use the createCustomQuery method for custom queries with type safety
import { gql } from 'craft-api-client';

const query = gql`
  query GetCustomData($slug: String!) {
    entry(slug: $slug) {
      id
      title
      customField
    }
  }
`;

// Create a typed custom query function
const getCustomData = client.createCustomQuery<{ slug: string }, { entry: { id: string; title: string; customField: string } }>({
  query,
  // Optional: transform the response
  transformResponse: (data) => {
    // You can transform the data here if needed
    return data;
  }
});

// Use the custom query function with type safety
const result = await getCustomData({ slug: 'my-page' });
console.log(result.entry.title); // TypeScript knows the shape of the result

// You can still use the raw client for one-off queries
const rawResult = await client.client.request(query, { slug: 'my-page' });
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

### Type Safety

All operations are fully typed, providing excellent autocompletion and type checking:

```typescript
// TypeScript will show errors for invalid parameters
const entries = await client.getEntries({
  section: ['news'],
  limit: '10' // Error: Type 'string' is not assignable to type 'number'
});

// Autocomplete for return types
entries.forEach(entry => {
  console.log(entry.title); // TypeScript knows that entry has a title property
});
```

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
