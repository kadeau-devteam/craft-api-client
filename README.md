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

// Create a custom section query function
const getDestinations = client.createSectionQuery('destination', {
  fields: ['id', 'title', 'description', 'featuredImage']
});

// Use the custom section query function
const destinations = await getDestinations();
console.log(destinations);
// This will execute a query like:
// query Destination {
//   destinationEntries {
//     ... on destination_Entry {
//       id
//       title
//       description
//       featuredImage
//     }
//   }
// }
```

### Advanced Usage with the Generated SDK

The client exposes the generated SDK and GraphQL client for advanced usage:

```typescript
// Access the generated SDK directly
const authorData = await client.sdk.GetAuthor({ id: '456' });

// Use the createCustomQuery method for custom queries with type safety
import { gql } from 'graphql-request';

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

### Type Safety

All operations are fully typed, providing excellent autocompletion and type checking:

```typescript
// TypeScript will show errors for invalid parameters
const entries = await client.getEntries({
  section: 'news',
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
- Custom section query generation
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

# Run tests
pnpm test

# Build the project
pnpm build
```

### GraphQL Code Generation

This project uses GraphQL Code Generator to generate TypeScript types and an SDK from GraphQL operations. The generated code provides type safety and autocompletion for GraphQL queries.

To generate the types and SDK:

```bash
pnpm codegen
```

This will:
1. Read the GraphQL schema from `src/schema.graphql`
2. Process GraphQL operations from `src/graphql/**/*.graphql`
3. Generate TypeScript types and an SDK in `src/generated/`

When adding new GraphQL operations, add them to the `src/graphql/` directory and run `pnpm codegen` to update the generated code.

## License

ISC
