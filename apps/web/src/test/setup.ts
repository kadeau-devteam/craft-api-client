import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { setupServer } from 'msw/node';

// Extend Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// Clean up after each test case (e.g., clearing jsdom)
afterEach(() => {
  cleanup();
});

// Create MSW server for API mocking
export const server = setupServer();

// Start the MSW server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    pathname: '/',
    query: {},
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock environment variables
process.env = {
  ...process.env,
  CRAFT_API_KEY: 'test-api-key',
  CRAFT_API_URL: 'https://test-craft-cms.example/api',
  CRAFT_PREVIEW_TOKEN: 'test-preview-token',
};

// Mock craft-api-client/preview module
vi.mock('craft-api-client/preview', () => {
  return {
    createPreviewClient: (config, previewToken) => {
      const token = previewToken || config.previewToken;

      if (!token) {
        throw new Error('Preview token is required for preview mode');
      }

      return {
        query: vi.fn().mockImplementation((document, variables) => {
          return Promise.resolve({});
        }),
        config: {
          ...config,
          previewToken: token,
        },
      };
    },
    isPreviewMode: (client) => {
      return Boolean(client.config.previewToken);
    },
  };
});
