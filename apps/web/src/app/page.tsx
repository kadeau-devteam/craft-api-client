import { craftClient, gql } from 'craft-api-client';
import TestPageQuery from '../graphql/queries/testPage.graphql';

export default async function Home() {
  const client = craftClient({
    apiKey: process.env.NEXT_PUBLIC_CRAFT_API_KEY || '',
    baseUrl: process.env.NEXT_PUBLIC_CRAFT_API_URL || ''
  });

  const pingResult = await client.ping();

  const entriesResult = await client.query<{ entries: any[] }>(gql`
    query GetEntries {
      entries {
        id
        title
        slug
        postDate
        section {
          handle
        }
      }
    }
  `);

  const pages = await client.query(
    TestPageQuery, {
      section: "pages"
    }
  );

  return (
    <main>
      <pre>{JSON.stringify(pingResult, null, 2)}</pre>
      <pre>{JSON.stringify(entriesResult, null, 2)}</pre>
      <pre>{JSON.stringify(pages, null, 2)}</pre>
    </main>
  );
}
