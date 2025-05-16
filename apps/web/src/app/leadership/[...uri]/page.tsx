import { createCraftClient } from 'craft-api-client';
import {
  GetLeadershipProfileDocument, GetLeadershipProfileQuery,
  GetLeadershipProfileQueryVariables,
} from "@/generated/craft-api/graphql";

export default async function LeadershipProfile({ params }: { params: { uri: string }}) {
  const client = createCraftClient({
    apiKey: process.env.CRAFT_API_KEY || '',
    baseUrl: process.env.CRAFT_API_URL || '',
    previewToken: process.env.CRAFT_PREVIEW_TOKEN || undefined
  });

  // Use imported GraphQL document for the destinations query
  const {entry} = await client.query<GetLeadershipProfileQuery, GetLeadershipProfileQueryVariables>(
    GetLeadershipProfileDocument,
    {
      uri: "leadership/fiona-mccambridge",
    }
  );
  return <pre>{JSON.stringify(entry, null, 2)}</pre>;
}