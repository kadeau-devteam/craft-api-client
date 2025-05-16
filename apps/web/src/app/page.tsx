import { createCraftClient } from 'craft-api-client';
import {GetLeadershipDocument, GetLeadershipQuery, GetLeadershipQueryVariables} from "@/generated/craft-api/graphql";

export default async function Home() {
  const client = createCraftClient({
    apiKey: process.env.CRAFT_API_KEY || '',
    baseUrl: process.env.CRAFT_API_URL || '',
    previewToken: process.env.CRAFT_PREVIEW_TOKEN || undefined
  });

  // Use imported GraphQL document for the destinations query
  const {leadershipEntries} = await client.query<GetLeadershipQuery, GetLeadershipQueryVariables>(
    GetLeadershipDocument
  );

  return (
    <main>
      <h1>Example of using GraphQL queries in Next.js</h1>

      <pre>{JSON.stringify(leadershipEntries, null, 2)}</pre>
    </main>
  );
}
