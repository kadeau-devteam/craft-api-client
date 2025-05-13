import { createCraftClient, gql } from 'craft-api-client';
// Import types from generated graphql
import { GetPagesQueryQuery as GetPagesQuery, GetPagesQueryQueryVariables as GetPagesQueryVariables, DestinationsQuery, DestinationsQueryVariables } from "../generated/graphql/graphql";
// Import GraphQL documents from files
import getPagesQueryDocument from '../graphql/getPages.graphql';
import destinationsQueryDocument from '../graphql/destinations.graphql';

export default async function Home() {
  const client = createCraftClient({
    apiKey: process.env.CRAFT_API_KEY || '',
    baseUrl: process.env.CRAFT_API_URL || '',
    previewToken: process.env.CRAFT_PREVIEW_TOKEN || undefined
  });

  // Define the type for the entries query result
  type EntriesQueryResult = {
    entries: Array<{
      id: string;
      title: string;
      slug: string;
      postDate: string;
      sectionId: string;
    }>;
  };

  const entriesResult = await client.query<EntriesQueryResult>(gql`
    query GetEntries {
      entries {
        id
        title
        slug
        postDate
        sectionId
      }
    }
  `);

  // Use imported GraphQL document for the pages query
  const pages = await client.query<GetPagesQuery, GetPagesQueryVariables>(
    getPagesQueryDocument
  );

  // Use imported GraphQL document for the destinations query
  const destinations = await client.query<DestinationsQuery, DestinationsQueryVariables>(
    destinationsQueryDocument
  );

  return (
    <main>
      <h1>Example of using GraphQL queries in Next.js</h1>

      <h2>Entries (using inline query with gql tag)</h2>
      <pre>{JSON.stringify(entriesResult, null, 2)}</pre>

      <h2>Pages (using imported query from file)</h2>
      <pre>{JSON.stringify(pages, null, 2)}</pre>

      <h2>Destinations (using imported query from file)</h2>
      <pre>{JSON.stringify(destinations, null, 2)}</pre>
    </main>
  );
}
