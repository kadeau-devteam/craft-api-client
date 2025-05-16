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
- Includes an example of using preview/draft mode with Next.js 15

## Preview Mode / Draft Mode

This application includes an example of how to use the Craft API client with Next.js 15 draft mode to preview draft content from Craft CMS.

### How It Works

1. The draft mode API route (`/api/enable-draft`) enables Next.js draft mode
2. When draft mode is enabled, we include the preview token in the Craft API client
3. The preview token allows the API to return draft content
4. The page displays different content based on whether draft mode is enabled

### Environment Variables

To use the preview functionality, you need to set the following environment variables:

```
CRAFT_PREVIEW_TOKEN=your-preview-token  # Required for preview mode
DRAFT_SECRET_TOKEN=your-secret-token    # Secret token to protect the draft mode API route
```

### Usage

1. Visit `/preview-example` to see the preview example page
2. To enable draft mode, visit: `/api/enable-draft?secret=YOUR_SECRET_TOKEN`
3. To disable draft mode, click the "Exit Draft Mode" button or visit: `/api/disable-draft`

### Implementation Details

The implementation consists of three main components:

1. **Draft Mode API Routes**:
   - `/api/enable-draft`: Enables draft mode and redirects to the preview page
   - `/api/disable-draft`: Disables draft mode and redirects back to the preview page

2. **Preview Example Page**:
   - `/preview-example`: Demonstrates how to use the Craft API client with draft mode
   - Conditionally includes the preview token based on draft mode status
   - Shows different UI based on draft mode status

3. **Craft API Client Configuration**:
   - Uses the `previewToken` parameter when creating the client
   - Only includes the token when draft mode is enabled

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

# Run only tests that use the real API
pnpm test:real-api

# Run only tests that use mocks
pnpm test:mock-api

# Run all integration tests (both mock and real API)
pnpm test:integration
```

#### Mock vs. Real API Tests

This application includes two types of integration tests:

1. **Mock API Tests**: These tests use MSW (Mock Service Worker) to intercept API requests and return mock responses. They are faster, more reliable, and don't require an actual Craft CMS instance. These tests are suitable for CI/CD pipelines and local development.

2. **Real API Tests**: These tests make actual API calls to a Craft CMS instance using the credentials in your `.env.local` file. They provide higher confidence that the client works with a real API but are slower and require a working Craft CMS instance. These tests are suitable for verifying compatibility with your specific Craft CMS setup.

By default, the `pnpm test` command runs all tests, including both mock and real API tests if the required environment variables are set. If you want to skip the real API tests, you can set the `SKIP_REAL_API_TESTS` environment variable to `true`.

### Test Structure

The tests are organized as follows:

- `src/test/setup.ts`: Test setup file that configures Vitest, MSW, and mocks
- `src/test/mocks/`: Mock implementations for testing
  - `preview.ts`: Mock implementation of the preview module
- `src/test/integration/`: Integration tests for the craft-api-client
  - `craft-api-client.test.ts`: Tests for basic client functionality using mocks
  - `craft-api-client-imported-queries.test.ts`: Tests for using imported GraphQL files with mocks
  - `craft-api-client-preview.test.ts`: Tests for the preview functionality with mocks
  - `craft-api-client-real-api.test.ts`: Tests that use the real Craft CMS API

### Integration Tests vs. Unit Tests

The tests in this application are considered **integration tests** because:

1. They test the integration between the Next.js application and the craft-api-client package
2. They verify that the client works correctly in the context of the Next.js application
3. They test multiple components working together (client, GraphQL queries, preview mode)
4. For mock tests: They mock external dependencies (the Craft CMS API) to isolate the integration being tested
5. For real API tests: They test the integration with the actual Craft CMS API

Unlike unit tests, which would test individual functions or components in isolation, these tests focus on how the craft-api-client package is used within the Next.js application and whether it behaves as expected in that context.

#### Why Use Both Mock and Real API Tests?

Using both mock and real API tests provides several benefits:

1. **Comprehensive Testing**: Mock tests ensure the client behaves correctly with expected responses, while real API tests verify compatibility with the actual API.
2. **Fast Feedback**: Mock tests run quickly and can be used during development for fast feedback.
3. **Reliability**: Mock tests are not affected by network issues, API changes, or service outages.
4. **Confidence**: Real API tests provide confidence that the client works with the actual API in production scenarios.
5. **CI/CD Compatibility**: Mock tests can run in CI/CD pipelines without requiring API credentials, while real API tests can be run selectively when needed.

### Troubleshooting Test Issues

If you encounter issues with the tests, here are some common solutions:

1. **Module Resolution Issues**: If you see errors like "Failed to resolve import 'craft-api-client/preview'", make sure the package is properly built with `pnpm build` in the root directory. The build command should include both the main module and the preview module.

2. **GraphQL Schema Issues**: If you see errors related to GraphQL schema validation, make sure the schema.graphql file in the craft-api-client package includes all the types used in your tests.

3. **Mock Implementation**: For testing the preview functionality, we use a local mock implementation in `src/test/mocks/preview.ts` instead of trying to import from the actual package. This approach avoids module resolution issues during testing.

4. **Real API Test Issues**: If the real API tests are failing, check the following:
   - Ensure your `.env.local` file contains valid API credentials
   - Verify that the Craft CMS instance is accessible and responding to requests
   - Check that the GraphQL schema on the server matches the queries in your tests
   - If you want to skip real API tests, set `SKIP_REAL_API_TESTS=true` in your environment

5. **Missing Dependencies**: If you see errors about missing dependencies like `dotenv`, make sure to install them with `pnpm add -D dotenv`.

## Learn More

To learn more about the craft-api-client, check out the [craft-api-client README](../../packages/craft-api-client/README.md).

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
