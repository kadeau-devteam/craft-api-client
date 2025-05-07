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

### Using Custom GraphQL Queries in Your Application

You can add your own custom GraphQL queries in your application and have them included in the code generation process. This allows you to extend the functionality of the client with your own queries while maintaining type safety.

To use this feature:

1. Create a directory for your custom GraphQL queries in your application, for example:
   ```
   src/
     graphql/
       queries/
         customQuery.graphql
   ```

2. Add your GraphQL queries to this directory. For example, in `customQuery.graphql`:
   ```graphql
   query CustomQuery($param: String!) {
     customData(param: $param) {
       id
       title
       customField
     }
   }
   ```

3. Run the code generation with your custom queries:
   ```bash
   CUSTOM_DOCUMENTS="./src/graphql/queries/**/*.graphql" pnpm --filter=craft-api-client codegen:with-custom
   ```

   Or add a script to your application's package.json:
   ```json
   "scripts": {
     "generate-api-client": "CUSTOM_DOCUMENTS=\"./src/graphql/queries/**/*.graphql\" pnpm --filter=craft-api-client codegen:with-custom"
   }
   ```

4. The generated SDK will now include your custom queries, which you can access through the client:
   ```typescript
   // The SDK now includes your custom query
   const result = await client.sdk.CustomQuery({ param: 'value' });
   console.log(result.customData);
   ```

This approach allows you to keep your application-specific queries separate from the core client library while still benefiting from type safety and code generation.

### Integration Testing with Custom Queries

To ensure your custom queries work correctly with the API, you can create integration tests. The package includes an example integration test that demonstrates how to test custom queries against a real API:

```typescript
// tests/integration/custom-query-integration.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import createCraftClient from 'craft-api-client';
import { gql } from 'graphql-request';
import fs from 'fs';
import path from 'path';

describe('Custom Query Integration', () => {
  let client;

  beforeAll(() => {
    // Create a client that points to the real API
    client = createCraftClient({
      apiKey: 'your-api-key',
      baseUrl: 'https://your-craft-site.com/api'
    });
  });

  it('should execute a custom query using createCustomQuery', async () => {
    // Create a custom query function using an inline query
    const getEntries = client.createCustomQuery({
      query: gql`
        query GetEntries($limit: Int) {
          entries(limit: $limit) {
            id
            title
          }
        }
      `
    });

    // Execute the query and verify the result
    const result = await getEntries({ limit: 3 });
    expect(result).toHaveProperty('entries');
  });

  it('should demonstrate how to use custom queries from a file', async () => {
    // Read the query from a .graphql file
    const queryPath = path.join(__dirname, 'graphql', 'queries', 'appCustomQuery.graphql');
    const queryContent = fs.readFileSync(queryPath, 'utf8');
    const query = gql`${queryContent}`;

    // Execute the query using the client's query method
    const result = await client.query({
      query,
      variables: { section: ["news"], limit: 2 }
    });

    // Verify the result
    expect(result).toHaveProperty('entries');
  });
});
```

To run the integration tests:

```bash
pnpm test:integration
```

You can adapt this approach to test your own custom queries against your API.

## License

ISC
