import {CraftClientConfig, createClient} from "./client.js";
import { DocumentNode } from 'graphql';
import { gql } from 'graphql-request';

/**
 * Re-export the gql function from graphql-request.
 * This function is used for creating GraphQL queries using template literals.
 * 
 * @example
 * ```typescript
 * // Using template literals
 * const query = gql`query { ... }`;
 * ```
 * 
 * Note: For imported .graphql files, you can pass the DocumentNode directly to client.query
 * @example
 * ```typescript
 * // Using imported .graphql files
 * import destinationsQuery from './queries/destinations.graphql';
 * const result = await client.query(destinationsQuery);
 * ```
 */
export { gql };

export type CraftClient = {
  /**
   * Execute a GraphQL query and get typed results.
   * 
   * This method accepts:
   * - Template literals processed with the gql tag
   * - DocumentNode objects from imported .graphql files
   * - Plain string queries
   * 
   * @example
   * ```typescript
   * // Define your query type
   * type DestinationsQuery = {
   *   destinationsEntries: Array<{
   *     id: string;
   *     title: string;
   *   }>;
   * };
   * 
   * // Use with template literals
   * const result1 = await client.query<DestinationsQuery>(gql`
   *   query Destinations {
   *     destinationsEntries {
   *       ... on destination_Entry {
   *         id
   *         title
   *       }
   *     }
   *   }
   * `);
   * 
   * // Use with imported .graphql files
   * import destinationsQuery from './queries/destinations.graphql';
   * const result2 = await client.query<DestinationsQuery>(destinationsQuery);
   * 
   * // Use with plain string
   * const result3 = await client.query<DestinationsQuery>(`
   *   query Destinations {
   *     destinationsEntries {
   *       ... on destination_Entry {
   *         id
   *         title
   *       }
   *     }
   *   }
   * `);
   * ```
   */
  query: <T = any, V extends Record<string, any> = Record<string, any>>(document: string | DocumentNode, variables?: V) => Promise<T>;
  config: CraftClientConfig;
  /**
   * Optional SDK that can be attached to the client.
   * This allows you to use a custom GraphQL SDK with the client.
   * 
   * @example
   * ```typescript
   * import { GraphQLClient } from 'graphql-request';
   * import { getSdk } from './graphql/sdk';
   * import { createCraftClient } from 'craft-api-client';
   * 
   * const client = createCraftClient({
   *   apiKey: 'your-api-key',
   *   baseUrl: 'your-api-url',
   *   sdk: getSdk(new GraphQLClient('your-api-url'))
   * });
   * 
   * // Now you can use the SDK methods
   * const result = await client.sdk.yourQuery();
   * ```
   */
  sdk?: any;
};

export function createCraftClient(config: CraftClientConfig): CraftClient {
  const rawClient = createClient(config);

  return {
    query: <T = any, V extends Record<string, any> = Record<string, any>>(document: string | DocumentNode, variables?: V): Promise<T> => {
      return rawClient.request<T>(document, variables);
    },
    config: (rawClient as any).config,
    sdk: (rawClient as any).sdk,
  };
}

// Keep the old function name for backward compatibility
export const craftClient = createCraftClient;

export default createCraftClient;
