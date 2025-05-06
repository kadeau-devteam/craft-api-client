import { describe, it, expect, beforeAll } from 'vitest';
import createCraftClient from '../../src/index.js';
import { gql } from 'graphql-request';
import fs from 'fs';
import path from 'path';

// This test demonstrates how to use custom GraphQL queries in an app
// and test them against the real Craft CMS API

describe('Custom Query Integration', () => {
  let client: ReturnType<typeof createCraftClient>;

  // Set up the client to use the real Craft CMS API
  beforeAll(() => {
    // Create a client that points to the real Craft CMS API
    client = createCraftClient({
      apiKey: '4G6leis24EdDxmrJN7uAypEiUIDuoq7u',
      baseUrl: 'https://mercury-sign.frb.io/api'
    });
  });

  it('should successfully ping the real API', async () => {
    const result = await client.ping();
    expect(result).toBe('pong');
  });

  it('should execute a custom query using createCustomQuery', async () => {
    // Define the types for our custom query
    interface EntriesQueryVariables {
      limit?: number;
    }

    interface EntriesQueryResult {
      entries: Array<{
        id: string;
        title: string;
        type: string;
        // Make section optional since it might not be present in all entries
        section?: {
          handle: string;
        };
      }>;
    }

    // Create a custom query function using the client's createCustomQuery method
    const getEntries = client.createCustomQuery<EntriesQueryVariables, EntriesQueryResult>({
      query: gql`
        query GetEntries($limit: Int) {
          entries(limit: $limit) {
            id
            title
            section {
              handle
            }
          }
        }
      `
    });

    // Execute the custom query
    const result = await getEntries({ limit: 3 });

    // Verify the result
    expect(result).toHaveProperty('entries');
    expect(Array.isArray(result.entries)).toBe(true);

    // If there are entries, verify their structure
    if (result.entries.length > 0) {
      const firstEntry = result.entries[0];
      expect(firstEntry).toHaveProperty('id');
      expect(firstEntry).toHaveProperty('title');
      // Only check section if it exists
      if (firstEntry.section) {
        expect(firstEntry.section).toHaveProperty('handle');
      }
    }
  });

  it('should demonstrate how to use custom queries from a file in an app', async () => {
    // This test demonstrates how to use custom GraphQL queries from a file
    // In a real app, you would:
    // 1. Create a .graphql file in your app's src/graphql/queries directory
    // 2. Run the codegen command to generate types for your query
    // 3. Use the generated types with the client's sdk
    //
    // For this test, we've created an actual .graphql file at:
    // tests/integration/graphql/queries/appCustomQuery.graphql

    // Step 1: Read the query from a .graphql file
    const queryPath = path.join(__dirname, 'graphql', 'queries', 'appCustomQuery.graphql');
    const queryContent = fs.readFileSync(queryPath, 'utf8');
    const query = gql`${queryContent}`;

    // Step 2: Execute the query using the client's query method
    const result = await client.query({
      query,
      variables: { section: ["news"], limit: 2 }
    });

    // Step 3: Verify the result
    expect(result).toHaveProperty('entries');
    expect(Array.isArray(result.entries)).toBe(true);

    // If there are entries, verify their structure
    if (result.entries.length > 0) {
      const firstEntry = result.entries[0];
      expect(firstEntry).toHaveProperty('id');
      expect(firstEntry).toHaveProperty('title');
      expect(firstEntry).toHaveProperty('type');
      // Only check section if it exists
      if (firstEntry.section) {
        expect(firstEntry.section).toHaveProperty('handle');
      }
    }

    // In a real app with code generation, you would use the SDK directly:
    // const result = await client.sdk.AppCustomQuery({ section: ["news"], limit: 2 });
  });
});
