import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCraftClient, gql } from 'craft-api-client';
import { server } from '../setup';
import { http, HttpResponse } from 'msw';

// Mock data for tests
const mockEntriesData = {
  data: {
    entries: [
      {
        id: '123',
        title: 'Test Entry',
        slug: 'test-entry',
        postDate: '2023-01-01T00:00:00Z',
        section: {
          handle: 'test',
        },
      },
    ],
  },
};

const mockPagesData = {
  data: {
    pages: [
      {
        id: '456',
        title: 'Test Page',
        slug: 'test-page',
      },
    ],
  },
};

describe('craft-api-client integration tests', () => {
  let client: ReturnType<typeof createCraftClient>;

  beforeEach(() => {
    // Reset the client before each test
    client = createCraftClient({
      apiKey: process.env.CRAFT_API_KEY || '',
      baseUrl: process.env.CRAFT_API_URL || '',
      previewToken: process.env.CRAFT_PREVIEW_TOKEN || undefined,
    });

    // Reset the MSW handlers
    server.resetHandlers();
  });

  it('should initialize the client with the correct configuration', () => {
    expect(client).toBeDefined();
    expect(client.config).toEqual({
      apiKey: 'test-api-key',
      baseUrl: 'https://test-craft-cms.example/api',
      previewToken: 'test-preview-token',
    });
  });

  it('should successfully query data using gql tag', async () => {
    // Mock the GraphQL API response
    server.use(
      http.post('https://test-craft-cms.example/api', async () => {
        return HttpResponse.json(mockEntriesData);
      })
    );

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

    // Execute the query
    const result = await client.query<EntriesQueryResult>(gql`
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

    // Verify the result
    expect(result).toEqual(mockEntriesData.data);
    expect(result.entries).toHaveLength(1);
    expect(result.entries[0].title).toBe('Test Entry');
  });

  it('should handle errors gracefully', async () => {
    // Mock an error response
    server.use(
      http.post('https://test-craft-cms.example/api', async () => {
        return new HttpResponse(
          JSON.stringify({
            errors: [{ message: 'GraphQL Error: Invalid query' }],
          }),
          { status: 400 }
        );
      })
    );

    // Execute a query that will fail
    try {
      await client.query(gql`
        query GetEntries {
          entries {
            id
          }
        }
      `);
      // If the query doesn't throw, fail the test
      expect(true).toBe(false);
    } catch (error) {
      // Verify that the error is handled correctly
      expect(error).toBeDefined();
      expect((error as Error).message).toContain('GraphQL Error');
    }
  });

  it('should work with preview mode', async () => {
    // Mock the GraphQL API response for preview mode
    server.use(
      http.post('https://test-craft-cms.example/api', async ({ request }) => {
        // Check if the preview token is included in the headers
        const headers = new Headers(request.headers);
        const previewToken = headers.get('X-Craft-Token');
        
        if (previewToken === 'test-preview-token') {
          return HttpResponse.json(mockPagesData);
        } else {
          return new HttpResponse(
            JSON.stringify({
              errors: [{ message: 'Unauthorized: Preview token missing or invalid' }],
            }),
            { status: 401 }
          );
        }
      })
    );

    // Execute a query with preview mode
    const result = await client.query(gql`
      query GetPages {
        pages {
          id
          title
          slug
        }
      }
    `);

    // Verify the result
    expect(result).toEqual(mockPagesData.data);
    expect(result.pages).toHaveLength(1);
    expect(result.pages[0].title).toBe('Test Page');
  });
});