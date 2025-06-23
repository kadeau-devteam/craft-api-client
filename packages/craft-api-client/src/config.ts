// Configuration interface for Craft API Client
import { CraftClientConfig } from './client.js';

/**
 * Define configuration for the Craft API Client
 * 
 * @param config - The configuration object
 * @returns The configuration object
 * 
 * @example
 * ```typescript
 * import { defineConfig } from 'craft-api-client/config';
 * 
 * export default defineConfig({
 *   apiKey: process.env.CRAFT_API_KEY as string,
 *   baseUrl: process.env.CRAFT_API_URL as string,
 * });
 * ```
 */
export function defineConfig(config: CraftClientConfig): CraftClientConfig {
  return config;
}

export type { CraftClientConfig };
