import { createCraftClient, gql } from 'craft-api-client';
// Import types from generated graphql
import { GetPagesQueryQuery as GetPagesQuery, GetPagesQueryQueryVariables as GetPagesQueryVariables } from "../generated/graphql/graphql";
// These imports will be available after running codegen
// import { TestPageQueryDocument, TestPageQueryQuery, TestPageQueryQueryVariables } from '../generated/graphql';

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
      section: {
        handle: string;
      };
    }>;
  };

  const entriesResult = await client.query<EntriesQueryResult>(gql`
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

  // Use gql tag for the pages query
  const pages = await client.query<GetPagesQuery, GetPagesQueryVariables>(
    gql`
      query getPagesQuery {
        pagesEntries {
          ... on page_Entry {
            id
            title
            contentBuilder {
              ... on cta_Entry {
                id
                title
              }
              ... on highlightTextSection_Entry {
                id
                title
              }
              ... on articlesSection_Entry {
                id
                title
              }
            }
          }
        }
      }
    `,
  );

  return (
    <main>
      <pre>{JSON.stringify(entriesResult, null, 2)}</pre>
      <pre>{JSON.stringify(pages, null, 2)}</pre>
    </main>
  );
}
