# Craft API Client Demo (Next.js App)

This is a Next.js application that demonstrates the usage of the craft-api-client package.

## Getting Started

### Prerequisites

- Node.js >= 20.10.0
- PNPM >= 10.5.2

### Environment Variables

Create a `.env.local` file in the root of the app with the following variables:

```
CRAFT_API_KEY=your-craft-api-key
CRAFT_API_URL=https://your-craft-cms-url/api
CRAFT_GRAPHQL_SCHEMA=https://your-craft-cms-url/actions/graphql/api
CRAFT_PREVIEW_TOKEN=your-preview-token  # Optional, for preview mode
```

### Installation

```bash
# From the root of the monorepo
pnpm install
```

### Development

```bash
# From the root of the monorepo
pnpm dev

# Or specifically for this app
cd apps/web
pnpm dev
```

This will start the development server at [http://localhost:3000](http://localhost:3000).

### Building for Production

```bash
# From the root of the monorepo
pnpm build

# Or specifically for this app
cd apps/web
pnpm build
```

## Features

- Demonstrates how to use the craft-api-client in a Next.js application
- Shows how to configure environment variables for the client
- Provides a simple UI for testing the API connection

## Testing

This application includes integration tests for the craft-api-client package. These tests verify that the client works correctly within the Next.js application.

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

### Test Structure

The tests are organized as follows:

- `src/test/setup.ts`: Test setup file that configures Vitest, MSW, and mocks
- `src/test/mocks/`: Mock implementations for testing
  - `preview.ts`: Mock implementation of the preview module
- `src/test/integration/`: Integration tests for the craft-api-client
  - `craft-api-client.test.ts`: Tests for basic client functionality
  - `craft-api-client-imported-queries.test.ts`: Tests for using imported GraphQL files
  - `craft-api-client-preview.test.ts`: Tests for the preview functionality

### Integration Tests vs. Unit Tests

The tests in this application are considered **integration tests** because:

1. They test the integration between the Next.js application and the craft-api-client package
2. They verify that the client works correctly in the context of the Next.js application
3. They test multiple components working together (client, GraphQL queries, preview mode)
4. They mock external dependencies (the Craft CMS API) to isolate the integration being tested

Unlike unit tests, which would test individual functions or components in isolation, these tests focus on how the craft-api-client package is used within the Next.js application and whether it behaves as expected in that context.

### Troubleshooting Test Issues

If you encounter issues with the tests, here are some common solutions:

1. **Module Resolution Issues**: If you see errors like "Failed to resolve import 'craft-api-client/preview'", make sure the package is properly built with `pnpm build` in the root directory. The build command should include both the main module and the preview module.

2. **GraphQL Schema Issues**: If you see errors related to GraphQL schema validation, make sure the schema.graphql file in the craft-api-client package includes all the types used in your tests.

3. **Mock Implementation**: For testing the preview functionality, we use a local mock implementation in `src/test/mocks/preview.ts` instead of trying to import from the actual package. This approach avoids module resolution issues during testing.

## Learn More

To learn more about the craft-api-client, check out the [craft-api-client README](../../packages/craft-api-client/README.md).

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
