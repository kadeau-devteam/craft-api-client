import { vi } from 'vitest';

// Define the CraftClient type
export type CraftClient = {
  query: <T = any, V extends Record<string, any> = Record<string, any>>(document: string | any, variables?: V) => Promise<T>;
  config: {
    apiKey: string;
    baseUrl: string;
    previewToken?: string;
  };
};

// Define the CraftClientConfig type
export type CraftClientConfig = {
  apiKey: string;
  baseUrl: string;
  previewToken?: string;
};

/**
 * Creates a Craft client with preview mode enabled.
 */
export function createPreviewClient(
  config: CraftClientConfig,
  previewToken?: string
): CraftClient {
  // Use the provided previewToken or the one from the config
  const token = previewToken || config.previewToken;
  
  if (!token) {
    throw new Error('Preview token is required for preview mode');
  }
  
  return {
    query: vi.fn().mockImplementation((document, variables) => {
      return Promise.resolve({
        pages: [
          {
            id: '456',
            title: 'Test Page (Preview)',
            slug: 'test-page',
            status: 'draft',
          },
        ],
      });
    }),
    config: {
      ...config,
      previewToken: token,
    },
  };
}

/**
 * Checks if a client is in preview mode.
 */
export function isPreviewMode(client: CraftClient): boolean {
  return Boolean(client.config.previewToken);
}