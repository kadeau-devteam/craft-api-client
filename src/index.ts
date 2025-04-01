export interface CraftClientConfig {
  apiKey: string;
  baseUrl: string;
}

export interface GraphQLQueryOptions {
  query: string;
  variables?: Record<string, unknown>;
}

// Craft CMS specific types
export interface Entry {
  id: string;
  title: string;
  slug: string;
  type: string;
  section: {
    handle: string;
  };
  // Add more fields as needed
}

export interface EntryQueryOptions extends Record<string, unknown> {
  section?: string;
  type?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  relatedTo?: string[];
}

function createCraftClient(config: CraftClientConfig) {
  // True privacy through closure
  const apiKey = config.apiKey;
  const baseUrl = config.baseUrl;

  // Methods are just functions that have access to the closure
  async function query<T = unknown>({ query, variables }: GraphQLQueryOptions): Promise<T> {
    const response = await fetch(`${baseUrl}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`GraphQL request failed: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(`GraphQL Error: ${result.errors[0].message}`);
    }

    return result.data as T;
  }

  // Return an object with methods
  return {
    query,
    getEntries: async (options: EntryQueryOptions = {}) => {
      const queryString = `
        query GetEntries($section: String, $type: String, $limit: Int, $offset: Int, $orderBy: String, $relatedTo: [QueryArgument]) {
          entries(
            section: $section
            type: $type
            limit: $limit
            offset: $offset
            orderBy: $orderBy
            relatedTo: $relatedTo
          ) {
            id
            title
            slug
            type
            section {
              handle
            }
          }
        }
      `;
      const result = await query<{ entries: Entry[] }>({
        query: queryString,
        variables: options,
      });
      return result.entries;
    },
    getEntry: async (id: string) => {
      const queryString = `
        query GetEntry($id: ID!) {
          entry(id: $id) {
            id
            title
            slug
            type
            section {
              handle
            }
          }
        }
      `;
      const result = await query<{ entry: Entry | null }>({
        query: queryString,
        variables: { id },
      });
      return result.entry;
    },
  };
}

export default createCraftClient;

