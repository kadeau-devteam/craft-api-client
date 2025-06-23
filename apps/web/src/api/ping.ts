import { createCraftClient, gql } from 'craft-api-client';

export async function ping(): Promise<{ ping: boolean }> {
  const client = createCraftClient({
    apiKey: process.env.CRAFT_API_KEY || '',
    baseUrl: process.env.CRAFT_API_URL || '',
    previewToken: process.env.CRAFT_PREVIEW_TOKEN || undefined
  });

  const query = gql`
      {
          ping
      }
  `;

  return client.query<{ ping: boolean }>(query);
}