# Craft API Client

A TypeScript client library for interacting with the Craft CMS API. This library provides a type-safe way to query your Craft CMS GraphQL API with full TypeScript support.

## Installation

```bash
# Using pnpm (recommended)
pnpm add craft-api-client

# Using npm
npm install craft-api-client

# Using yarn
yarn add craft-api-client
```

## Usage

```typescript
// Using named import
import { createCraftClient } from 'craft-api-client';

// Create a client instance
const client = createCraftClient({
  apiKey: 'your-craft-api-key',
  baseUrl: 'https://your-craft-site.com/api'
});
```

You can also use the default export for a more concise import:

```typescript
// Using default import
import craftClient from 'craft-api-client';

// Create a client instance
const client = craftClient({
  apiKey: 'your-craft-api-key',
  baseUrl: 'https://your-craft-site.com/api'
});

// Check if the API is available
const pingResult = await client.ping();
console.log(pingResult); // { ping: 'pong' }

// Use the raw query method for custom GraphQL queries
import { gql } from 'graphql-request';

// Fetch entries from a specific section
const entriesResult = await client.query(gql`
  query GetEntries($section: [String], $limit: Int, $orderBy: String) {
    entries(section: $section, limit: $limit, orderBy: $orderBy) {
      id
      title
      slug
      postDate
    }
  }
`, {
  section: ['news'],
  limit: 10,
  orderBy: 'postDate DESC'
});

// Fetch a specific entry by ID
const entryResult = await client.query(gql`
  query GetEntry($id: ID!) {
    entry(id: $id) {
      id
      title
      slug
      postDate
    }
  }
`, {
  id: '123'
});
```

### Advanced Usage with the Generated SDK

The client exposes the generated SDK for advanced usage:

```typescript
// Access the generated SDK directly
// Currently, the SDK only includes the ping query
const pingResult = await client.ping();
console.log(pingResult); // { ping: 'pong' }

// For custom queries, use the query method
import { gql } from 'graphql-request';

const query = gql`
  query GetCustomData($id: ID!) {
    entry(id: $id) {
      id
      title
      slug
      postDate
    }
  }
`;

// Use the query method with type safety by defining the response type
type CustomDataResponse = {
  entry: {
    id: string;
    title: string;
    slug: string;
    postDate: string;
  }
};

// Execute the query with type safety
const result = await client.query<CustomDataResponse>(query, { id: '123' });
console.log(result.entry.title); // TypeScript knows the shape of the result
```

As you extend the GraphQL schema with your own types and queries, you can generate a more comprehensive SDK using the code generation tools provided with this library.

### Type Safety

All operations are fully typed, providing excellent autocompletion and type checking:

```typescript
import { gql } from 'graphql-request';

// Define the response type for type safety
type EntriesResponse = {
  entries: Array<{
    id: string;
    title: string;
    slug: string;
    postDate: string;
  }>
};

// TypeScript will show errors for invalid parameters
const query = gql`
  query GetEntries($section: [String], $limit: Int) {
    entries(section: $section, limit: $limit) {
      id
      title
      slug
      postDate
    }
  }
`;

// This would cause a TypeScript error: Type 'string' is not assignable to type 'number'
// const result = await client.query<EntriesResponse>(query, {
//   section: ['news'],
//   limit: '10' 
// });

// Correct usage with proper types
const result = await client.query<EntriesResponse>(query, {
  section: ['news'],
  limit: 10
});

// Autocomplete for return types
result.entries.forEach(entry => {
  console.log(entry.title); // TypeScript knows that entry has a title property
});
```

## Features

- Modern ESM package
- Full TypeScript support
- Tree-shakeable
- Built with tsup for efficient bundling
- Type-safe GraphQL queries
- Built on graphql-request for efficient API communication
- Generated SDK for type-safe API interactions
- GraphQL Code Generator integration for custom schema support
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

# Run tests in specific files
pnpm test tests/client.test.ts

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
2. Process GraphQL operations defined in the project
3. Generate TypeScript types and an SDK in `cms/generated/`

The schema in `src/schema.graphql` is a simplified version and should be replaced with the actual schema from your Craft CMS instance for production use.

### Using Custom GraphQL Queries

You can create custom GraphQL queries to interact with your Craft CMS API. This allows you to fetch exactly the data you need while maintaining type safety.

To use custom queries:

1. Define your GraphQL query using the `gql` tag from graphql-request:
   ```typescript
   import { gql } from 'graphql-request';

   const query = gql`
     query GetArticles($limit: Int, $category: String) {
       entries(section: ["articles"], limit: $limit, relatedTo: [$category]) {
         id
         title
         slug
         postDate
       }
     }
   `;
   ```

2. Define a TypeScript type for the expected response:
   ```typescript
   type ArticlesResponse = {
     entries: Array<{
       id: string;
       title: string;
       slug: string;
       postDate: string;
     }>
   };
   ```

3. Execute the query with type safety:
   ```typescript
   const result = await client.query<ArticlesResponse>(query, {
     limit: 10,
     category: "news"
   });

   // TypeScript knows the shape of the result
   result.entries.forEach(article => {
     console.log(article.title);
   });
   ```

This approach allows you to create custom queries for your specific needs while still benefiting from TypeScript's type safety.

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
