import { GraphQLClient } from 'graphql-request';
import type {
  GetEntriesQueryVariables,
} from './generated/graphql.js';
import { 
  getSdk, 
  Entry 
} from './generated/graphql.js';

export interface CraftClientConfig {
  apiKey: string;
  baseUrl: string;
}


export interface CustomQueryOptions<TVariables = Record<string, unknown>, TData = unknown> {
  query: string;
  transformResponse?: (data: any) => TData;
}

export interface EntryQueryOptions extends Record<string, unknown> {
  section?: string[];
  type?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  relatedTo?: string[];
}

export interface QueryOptions {
  query: string;
  variables?: Record<string, unknown>;
}

// Re-export types from generated SDK
export { Entry };

function createCraftClient(config: CraftClientConfig): {
  sdk: ReturnType<typeof getSdk>;
  client: GraphQLClient;
  createCustomQuery: <TVariables = Record<string, unknown>, TData = unknown>(options: CustomQueryOptions<TVariables, TData>) => (variables: TVariables) => Promise<TData>;
  query: (options: QueryOptions) => Promise<any>;
  ping: () => Promise<string>;
  getEntries: (options?: EntryQueryOptions) => Promise<any>;
  getEntry: (id: string) => Promise<any>;
} {
  // Validate required parameters
  if (!config.apiKey) {
    throw new Error('apiKey is required');
  }
  if (!config.baseUrl) {
    throw new Error('baseUrl is required');
  }

  // Create GraphQL client
  const client = new GraphQLClient(config.baseUrl, {
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
    },
    fetch: fetch, // Use global fetch to ensure it can be mocked in tests
  });

  // Get the generated SDK
  const sdk = getSdk(client);


  // Helper function to create a custom query
  function createCustomQuery<TVariables = Record<string, unknown>, TData = unknown>(
    options: CustomQueryOptions<TVariables, TData>
  ) {
    const { query, transformResponse } = options;

    return async (variables: TVariables) => {
      // Execute the custom query using the GraphQL client
      const result = await client.request(query, variables as Record<string, unknown>);

      // Transform the response if a transform function is provided
      if (transformResponse) {
        return transformResponse(result);
      }

      return result as TData;
    };
  }

  // Return an object with methods
  return {
    // Expose the raw SDK for advanced usage
    sdk,

    // Expose the raw client for custom queries
    client,

    // Helper methods
    createCustomQuery,

    // Direct query method for tests and simple queries
    query: async (options: QueryOptions) => {
      const { query, variables } = options;
      return client.request(query, variables);
    },

    // Convenience methods that map to the generated SDK
    ping: async (): Promise<string> => {
      const result = await sdk.Ping();
      return result.ping;
    },

    getEntries: async (options: EntryQueryOptions = {}) => {
      const result = await sdk.GetEntries(options as GetEntriesQueryVariables);
      return result.entries;
    },

    getEntry: async (id: string) => {
      const result = await sdk.GetEntry({ id });
      return result.entry;
    },
  };
}

export default createCraftClient;
