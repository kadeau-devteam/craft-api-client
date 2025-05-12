import { CraftClientConfig, createClient } from './client.js';
import { CraftClient } from './index.js';

/**
 * Creates a Craft client with preview mode enabled.
 * 
 * @param config The client configuration
 * @param previewToken The preview token to use (overrides config.previewToken if provided)
 * @returns A Craft client with preview mode enabled
 * 
 * @example
 * ```typescript
 * import { createPreviewClient } from 'craft-api-client/preview';
 * 
 * const previewClient = createPreviewClient({
 *   apiKey: process.env.CRAFT_API_KEY || '',
 *   baseUrl: process.env.CRAFT_API_URL || '',
 * }, process.env.CRAFT_PREVIEW_TOKEN);
 * 
 * // Or use the token from the config
 * const previewClient = createPreviewClient({
 *   apiKey: process.env.CRAFT_API_KEY || '',
 *   baseUrl: process.env.CRAFT_API_URL || '',
 *   previewToken: process.env.CRAFT_PREVIEW_TOKEN,
 * });
 * ```
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
  
  const rawClient = createClient({
    ...config,
    previewToken: token,
  });
  
  return {
    query: (document, variables) => {
      return rawClient.request(document, variables);
    },
    config: (rawClient as any).config,
  };
}

/**
 * Checks if a client is in preview mode.
 * 
 * @param client The client to check
 * @returns True if the client is in preview mode, false otherwise
 * 
 * @example
 * ```typescript
 * import { isPreviewMode } from 'craft-api-client/preview';
 * 
 * const client = createCraftClient({
 *   apiKey: process.env.CRAFT_API_KEY || '',
 *   baseUrl: process.env.CRAFT_API_URL || '',
 *   previewToken: process.env.CRAFT_PREVIEW_TOKEN,
 * });
 * 
 * if (isPreviewMode(client)) {
 *   console.log('Client is in preview mode');
 * }
 * ```
 */
export function isPreviewMode(client: CraftClient): boolean {
  return Boolean(client.config.previewToken);
}