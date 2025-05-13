import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createCraftClient, gql } from 'craft-api-client';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { server } from '../setup';

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = dotenv.config({ path: envPath });

  // Explicitly set environment variables from .env.local
  if (envConfig.parsed) {
    process.env.CRAFT_API_KEY = envConfig.parsed.CRAFT_API_KEY;
    process.env.CRAFT_API_URL = envConfig.parsed.CRAFT_API_URL;
    process.env.CRAFT_PREVIEW_TOKEN = envConfig.parsed.CRAFT_PREVIEW_TOKEN;

    console.log('Using API URL from .env.local:', process.env.CRAFT_API_URL);
  }
}

// Skip these tests if required environment variables are not set
const shouldRunTests = 
  process.env.CRAFT_API_KEY && 
  process.env.CRAFT_API_URL && 
  process.env.SKIP_REAL_API_TESTS !== 'true';

// Conditionally run the tests
const testRunner = shouldRunTests ? describe : describe.skip;

testRunner('craft-api-client integration tests with real API', () => {
  let client: ReturnType<typeof createCraftClient>;

  beforeAll(() => {
    // Disable MSW to allow real API requests
    server.close();

    // Create a client with real API credentials
    client = createCraftClient({
      apiKey: process.env.CRAFT_API_KEY || '',
      baseUrl: process.env.CRAFT_API_URL || '',
      previewToken: process.env.CRAFT_PREVIEW_TOKEN || undefined,
    });
  });

  afterAll(() => {
    // Re-enable MSW for other tests
    server.listen({ onUnhandledRequest: 'error' });
  });

  it('should successfully query data from the real API', async () => {
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

    // Execute the query against the real API
    const result = await client.query<EntriesQueryResult>(gql`
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

    // Verify the result structure without asserting specific values
    expect(result).toBeDefined();
    expect(result.entries).toBeDefined();
    expect(Array.isArray(result.entries)).toBe(true);

    // If there are entries, verify their structure
    if (result.entries.length > 0) {
      const firstEntry = result.entries[0];
      expect(firstEntry.id).toBeDefined();
      expect(firstEntry.title).toBeDefined();
      expect(firstEntry.slug).toBeDefined();
      expect(firstEntry.postDate).toBeDefined();
      expect(firstEntry.sectionId).toBeDefined();
    }
  });

  it('should query destinations from the real API', async () => {
    // Define the type for the destinations query result
    type DestinationsQueryResult = {
      destinationsEntries: Array<{
        id: string;
        title: string;
        slug: string;
      }>;
    };

    // Execute the query against the real API
    const result = await client.query<DestinationsQueryResult>(gql`
      query Destinations {
        destinationsEntries {
          ... on destination_Entry {
            id
            title
            slug
          }
        }
      }
    `);

    // Verify the result structure without asserting specific values
    expect(result).toBeDefined();
    expect(result.destinationsEntries).toBeDefined();
    expect(Array.isArray(result.destinationsEntries)).toBe(true);
  });

  it('should work with preview mode if preview token is provided', async () => {
    // Skip this test if preview token is not provided
    if (!process.env.CRAFT_PREVIEW_TOKEN) {
      console.log('Skipping preview mode test because CRAFT_PREVIEW_TOKEN is not set');
      return;
    }

    // Define the type for the pages query result
    type PagesQueryResult = {
      pagesEntries: Array<{
        id: string;
        title: string;
      }>;
    };

    // Execute the query with preview mode
    const result = await client.query<PagesQueryResult>(gql`
      query GetPages {
        pagesEntries {
          ... on page_Entry {
            id
            title
          }
        }
      }
    `);

    // Verify the result structure without asserting specific values
    expect(result).toBeDefined();
    expect(result.pagesEntries).toBeDefined();
    expect(Array.isArray(result.pagesEntries)).toBe(true);
  });
});
