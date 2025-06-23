import { createCraftClient, gql } from 'craft-api-client';

export default async function Home() {
  const client = createCraftClient({
    apiKey: process.env.CRAFT_API_KEY || '',
    baseUrl: process.env.CRAFT_API_URL || '',
    previewToken: process.env.CRAFT_PREVIEW_TOKEN || undefined
  });

  // Use a direct GraphQL query to test the connection to the Craft CMS API
  const pingResult = await client.query<{ ping: boolean }>(gql`
    {
      ping
    }
  `);

  return (
    <main>
      <h1>Example of using GraphQL queries in Next.js</h1>

      <h2>Ping Result:</h2>
      <pre>{JSON.stringify(pingResult, null, 2)}</pre>
    </main>
  );
}
