import { describe, it, expect, beforeAll } from 'vitest';
import createCraftClient from '../../src/index.js';
import { gql } from 'graphql-request';
import fs from 'fs';
import path from 'path';

describe('GetEntries Integration', () => {
  let client: ReturnType<typeof createCraftClient>;

  // Set up the client to use the real Craft CMS API
  beforeAll(() => {
    // Create a client that points to the real Craft CMS API
    client = createCraftClient({
      apiKey: '4G6leis24EdDxmrJN7uAypEiUIDuoq7u',
      baseUrl: 'https://mercury-sign.frb.io/api'
    });
  });

  it('should successfully fetch destinations entries with ordering', async () => {
    // Read the custom query from the file
    const queryPath = path.join(__dirname, 'graphql', 'queries', 'getDestinationEntries.graphql');
    const queryContent = fs.readFileSync(queryPath, 'utf8');
    const query = gql`${queryContent}`;

    // Execute the query with the specified parameters
    const result = await client.query({
      query,
      variables: {
        section: ['destinations'],
        limit: 10,
        orderBy: 'postDate DESC'
      }
    });

    // Extract the entries from the result
    const entries = result.entries;

    // Verify the result
    expect(Array.isArray(entries)).toBe(true);

    // Check that we got the correct number of entries (up to 10)
    expect(entries.length).toBeLessThanOrEqual(10);

    // If there are entries, verify they are from the news section
    if (entries.length > 0) {
      // Check the first entry has the expected properties
      const firstEntry = entries[0];
      expect(firstEntry).toHaveProperty('id');
      expect(firstEntry).toHaveProperty('title');

      // Verify the section is 'news'
      if (firstEntry.section) {
        expect(firstEntry.section).toHaveProperty('handle', 'news');
      }

      // If there are multiple entries, verify they are ordered by postDate DESC
      if (entries.length > 1) {
        // Check if entries have postDate property
        if (firstEntry.postDate && entries[1].postDate) {
          // Convert dates to timestamps for comparison
          const firstDate = new Date(firstEntry.postDate).getTime();
          const secondDate = new Date(entries[1].postDate).getTime();

          // First date should be greater than or equal to second date (DESC order)
          expect(firstDate).toBeGreaterThanOrEqual(secondDate);
        }
      }
    }
  });
});
