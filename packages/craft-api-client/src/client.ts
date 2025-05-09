import {GraphQLClient} from 'graphql-request';

export type CraftClientConfig = {
  apiKey: string;
  baseUrl: string;
};

export function createClient({ apiKey, baseUrl }: CraftClientConfig) {
  if (!apiKey) {
    throw new Error('apiKey is required');
  }

  if (!baseUrl) {
    throw new Error('baseUrl is required');
  }

  const client = new GraphQLClient(baseUrl, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  // Attach the config to the client for later access
  (client as any).config = { apiKey, baseUrl };

  return client;
}
