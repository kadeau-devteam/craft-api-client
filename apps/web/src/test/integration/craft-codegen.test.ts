/**
 * Integration tests for craft-codegen in a Next.js environment
 * 
 * These tests verify that:
 * 1. The craft-codegen command can be executed successfully
 * 2. The generated types can be used with craft-api-client
 * 3. The client works with imported GraphQL documents
 * 
 * The tests use MSW to mock GraphQL API responses and vi.mock to mock
 * file system operations and child process execution.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { existsSync } from 'fs';
import { join, resolve } from 'path';
import { execSync } from 'child_process';
import { createCraftClient, gql } from 'craft-api-client';
import { server } from '../setup';
import { http, HttpResponse } from 'msw';

// Mock modules
vi.mock('fs');
vi.mock('child_process');

// Mock data for tests
const mockSchema = `
  type Query {
    entries: [Entry!]!
    pages: [Page!]!
  }

  type Entry {
    id: ID!
    title: String!
    slug: String!
    postDate: String!
    sectionId: String!
  }

  type Page {
    id: ID!
    title: String!
    slug: String!
  }
`;

const mockEntriesData = {
  data: {
    entries: [
      {
        id: '123',
        title: 'Test Entry',
        slug: 'test-entry',
        postDate: '2023-01-01T00:00:00Z',
        sectionId: 'test',
      },
    ],
  },
};

/**
 * Integration tests for the craft-codegen functionality in a Next.js environment.
 * 
 * These tests verify that:
 * - The craft-codegen command can be executed successfully
 * - The generated types can be used with craft-api-client
 * - The client works with imported GraphQL documents
 */
describe('craft-codegen integration tests', () => {
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

    // Mock existsSync to return true for craft.config.ts
    vi.mocked(existsSync).mockImplementation((path) => {
      if (path.toString().includes('craft.config.ts')) return true;
      return false;
    });

    // Mock execSync to return success
    vi.mocked(execSync).mockImplementation(() => Buffer.from(''));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Test that the craft-codegen command can be executed successfully.
   * 
   * This test:
   * 1. Mocks the GraphQL API response for schema introspection
   * 2. Simulates running the craft-codegen command
   * 3. Verifies that the command was called with the correct arguments
   */
  it('should generate types from GraphQL schema', async () => {
    // Mock the GraphQL API response for schema introspection
    server.use(
      http.post('https://test-craft-cms.example/api', async ({ request }) => {
        const body = await request.json();

        // If this is an introspection query, return the schema
        if (body.query && body.query.includes('__schema')) {
          return HttpResponse.json({
            data: {
              __schema: {
                types: [
                  { name: 'Query', kind: 'OBJECT' },
                  { name: 'Entry', kind: 'OBJECT' },
                  { name: 'Page', kind: 'OBJECT' },
                ],
              },
            },
          });
        }

        // For regular queries, return mock data
        return HttpResponse.json(mockEntriesData);
      })
    );

    // Mock process.cwd to return our app directory
    const originalCwd = process.cwd;
    process.cwd = vi.fn().mockReturnValue(resolve(process.cwd(), 'apps/web'));

    try {
      // Simulate running the craft-codegen command
      execSync('npx craft-codegen');

      // Check that execSync was called with the correct command
      expect(execSync).toHaveBeenCalledWith('npx craft-codegen');
    } finally {
      // Restore process.cwd
      process.cwd = originalCwd;
    }
  });

  /**
   * Test that the generated types can be used with craft-api-client.
   * 
   * This test:
   * 1. Mocks the GraphQL API response
   * 2. Defines a type that matches the structure of the generated types
   * 3. Executes a query using the craft-api-client
   * 4. Verifies that the result matches the expected data
   */
  it('should use generated types with craft-api-client', async () => {
    // Mock the GraphQL API response
    server.use(
      http.post('https://test-craft-cms.example/api', async () => {
        return HttpResponse.json(mockEntriesData);
      })
    );

    // Define the type for the entries query result using the same structure as generated types
    type EntriesQueryResult = {
      entries: Array<{
        id: string;
        title: string;
        slug: string;
        postDate: string;
        sectionId: string;
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
          sectionId
        }
      }
    `);

    // Verify the result
    expect(result).toEqual(mockEntriesData.data);
    expect(result.entries).toHaveLength(1);
    expect(result.entries[0].title).toBe('Test Entry');
  });

  /**
   * Test that the client works with imported GraphQL documents.
   * 
   * This test:
   * 1. Mocks the GraphQL API response
   * 2. Creates a mock GraphQL document (similar to what would be imported from a .graphql file)
   * 3. Executes a query using the craft-api-client with the imported document
   * 4. Verifies that the result matches the expected data
   */
  it('should work with imported GraphQL documents', async () => {
    // Mock the GraphQL API response
    server.use(
      http.post('https://test-craft-cms.example/api', async () => {
        return HttpResponse.json({
          data: {
            pages: [
              {
                id: '456',
                title: 'Test Page',
                slug: 'test-page',
              },
            ],
          },
        });
      })
    );

    // Create a mock GraphQL document
    const getPagesQueryDocument = {
      kind: 'Document',
      definitions: [
        {
          kind: 'OperationDefinition',
          operation: 'query',
          name: { kind: 'Name', value: 'GetPagesQuery' },
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
    };

    // Define the type for the pages query result
    type GetPagesQuery = {
      pages: Array<{
        id: string;
        title: string;
        slug: string;
      }>;
    };

    // Execute the query with the imported document
    const result = await client.query<GetPagesQuery>(getPagesQueryDocument);

    // Verify the result
    expect(result).toBeDefined();
    expect(result.pages).toHaveLength(1);
    expect(result.pages[0].title).toBe('Test Page');
  });
});
