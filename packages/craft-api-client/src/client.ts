import {GraphQLClient} from 'graphql-request';

export type CraftClientConfig = {
  apiKey: string;
  baseUrl: string;
  previewToken?: string;
  sdk?: any;
};

export function createClient({ apiKey, baseUrl, previewToken, sdk }: CraftClientConfig) {
  if (!apiKey) {
    throw new Error('apiKey is required');
  }

  if (!baseUrl) {
    throw new Error('baseUrl is required');
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };

  // Add preview token if provided
  if (previewToken) {
    headers['X-Craft-Token'] = previewToken;
  }

  const client = new GraphQLClient(baseUrl, {
    headers,
  });

  // Attach the config to the client for later access
  (client as any).config = { apiKey, baseUrl, previewToken };

  // Attach the SDK if provided
  if (sdk) {
    (client as any).sdk = sdk;
  }

  return client;
}
