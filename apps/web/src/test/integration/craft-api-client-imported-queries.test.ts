import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCraftClient } from 'craft-api-client';
import { server } from '../setup';
import { http, HttpResponse } from 'msw';

// Mock the imported GraphQL file
vi.mock('../graphql/getPages.graphql', () => ({
  default: {
    kind: 'Document',
    definitions: [
      {
        kind: 'OperationDefinition',
        operation: 'query',
        name: { kind: 'Name', value: 'GetPages' },
        selectionSet: {
          kind: 'SelectionSet',
          selections: [
            {
              kind: 'Field',
              name: { kind: 'Name', value: 'pages' },
              selectionSet: {
                kind: 'SelectionSet',
                selections: [
                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                  { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                  { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                ],
              },
            },
          ],
        },
      },
    ],
  },
}));

// Mock data for tests
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

// Define the type for the pages query result
type GetPagesQuery = {
  pages: Array<{
    id: string;
    title: string;
    slug: string;
  }>;
};

type GetPagesQueryVariables = Record<string, never>;

describe('craft-api-client with imported GraphQL files', () => {
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

  it('should successfully query data using imported GraphQL files', async () => {
    // Mock the GraphQL API response
    server.use(
      http.post('https://test-craft-cms.example/api', async () => {
        return HttpResponse.json(mockPagesData);
      })
    );

    // Import the mocked GraphQL file
    const getPagesQuery = await import('../graphql/getPages.graphql');

    // Execute the query
    const result = await client.query<GetPagesQuery, GetPagesQueryVariables>(
      getPagesQuery.default
    );

    // Verify the result
    expect(result).toEqual(mockPagesData.data);
    expect(result.pages).toHaveLength(1);
    expect(result.pages[0].title).toBe('Test Page');
  });
});
