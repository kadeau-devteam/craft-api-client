import {GraphQLClient} from 'graphql-request';

export type CraftClientConfig = {
  apiKey: string;
  baseUrl: string;
};

export function createClient({ apiKey, baseUrl }: CraftClientConfig) {
  return new GraphQLClient(baseUrl, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });
}
