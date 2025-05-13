import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCraftClient } from 'craft-api-client';
import { createPreviewClient, isPreviewMode } from '../mocks/preview';
import { server } from '../setup';
import { http, HttpResponse } from 'msw';

// Mock data for tests
const mockPagesData = {
  data: {
    pages: [
      {
        id: '456',
        title: 'Test Page (Preview)',
        slug: 'test-page',
        status: 'draft',
      },
    ],
  },
};

describe('craft-api-client preview module', () => {
  beforeEach(() => {
    // Reset the MSW handlers
    server.resetHandlers();
  });

  it('should create a client with preview mode enabled', () => {
    // Create a client with preview mode enabled
    const previewClient = createPreviewClient({
      apiKey: process.env.CRAFT_API_KEY || '',
      baseUrl: process.env.CRAFT_API_URL || '',
    }, process.env.CRAFT_PREVIEW_TOKEN);

    // Verify that the client is in preview mode
    expect(isPreviewMode(previewClient)).toBe(true);
    expect(previewClient.config.previewToken).toBe('test-preview-token');
  });

  it('should detect preview mode correctly', () => {
    // Create a regular client
    const regularClient = createCraftClient({
      apiKey: process.env.CRAFT_API_KEY || '',
      baseUrl: process.env.CRAFT_API_URL || '',
    });

    // Create a client with preview mode enabled
    const previewClient = createPreviewClient({
      apiKey: process.env.CRAFT_API_KEY || '',
      baseUrl: process.env.CRAFT_API_URL || '',
    }, process.env.CRAFT_PREVIEW_TOKEN);

    // Verify that isPreviewMode returns the correct value
    expect(isPreviewMode(regularClient)).toBe(false);
    expect(isPreviewMode(previewClient)).toBe(true);
  });

  it('should include the preview token in API requests', async () => {
    // Mock the GraphQL API response
    server.use(
      http.post('https://test-craft-cms.example/api', async ({ request }) => {
        // Check if the preview token is included in the headers
        const headers = new Headers(request.headers);
        const previewToken = headers.get('X-Craft-Token');

        // Return different responses based on whether the preview token is present
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

    // Create a client with preview mode enabled
    const previewClient = createPreviewClient({
      apiKey: process.env.CRAFT_API_KEY || '',
      baseUrl: process.env.CRAFT_API_URL || '',
    }, process.env.CRAFT_PREVIEW_TOKEN);

    // Execute a query with preview mode
    const result = await previewClient.query(`
      query GetPages {
        pages {
          id
          title
          slug
          status
        }
      }
    `);

    // Verify the result
    expect(result).toEqual(mockPagesData.data);
    expect(result.pages).toHaveLength(1);
    expect(result.pages[0].title).toBe('Test Page (Preview)');
    expect(result.pages[0].status).toBe('draft');
  });

  it('should throw an error when creating a preview client without a token', () => {
    // Attempt to create a preview client without a token
    expect(() => {
      createPreviewClient({
        apiKey: process.env.CRAFT_API_KEY || '',
        baseUrl: process.env.CRAFT_API_URL || '',
      });
    }).toThrow('Preview token is required for preview mode');
  });
});
