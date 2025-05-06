import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import createCraftClient from '../src/index.js';

describe('CraftClient', () => {
  let client: ReturnType<typeof createCraftClient>;
  // Use the mockFetch defined in the outer scope, initialized in beforeEach
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn().mockResolvedValue({ // Default mock
      ok: true,
      json: () => Promise.resolve({ data: { test: 'data' } }),
      text: () => Promise.resolve(JSON.stringify({ data: { test: 'data' } })),
      headers: {
        get: (key: string) => {
          if (key.toLowerCase() === 'content-type') {
            return 'application/json';
          }
          return null;
        },
        forEach: (callback: (value: string, key: string) => void) => {
          callback('application/json', 'content-type');
        },
      },
    });
    vi.stubGlobal('fetch', mockFetch);

    client = createCraftClient({
      apiKey: '4G6leis24EdDxmrJN7uAypEiUIDuoq7u',
      baseUrl: 'https://mercury-sign.frb.io/api'
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });


  it('should create a client with required configuration', () => {
    expect(client).toHaveProperty('query');
    expect(client).toHaveProperty('ping');
    expect(client).toHaveProperty('getEntries');
    expect(client).toHaveProperty('getEntry');
    expect(typeof client.query).toBe('function');
    expect(typeof client.ping).toBe('function');
    expect(typeof client.getEntries).toBe('function');
    expect(typeof client.getEntry).toBe('function');
  });

  it('should throw an error when apiKey is not provided', () => {
    expect(() => {
      createCraftClient({
        apiKey: '',
        baseUrl: 'https://example.com/api'
      });
    }).toThrow('apiKey is required');
  });

  it('should throw an error when baseUrl is not provided', () => {
    expect(() => {
      createCraftClient({
        apiKey: '4G6leis24EdDxmrJN7uAypEiUIDuoq7u',
        baseUrl: ''
      });
    }).toThrow('baseUrl is required');
  });


  it('should make GraphQL requests with correct configuration', async () => {
    // The default mock from beforeEach is sufficient here
    await client.query({
      query: '{ test }',
      variables: { test: 'variable' }
    });

    expect(mockFetch).toHaveBeenCalled();

    expect(mockFetch).toHaveBeenCalledWith(
      'https://mercury-sign.frb.io/api',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 4G6leis24EdDxmrJN7uAypEiUIDuoq7u'
        },
        body: expect.any(String) // Or more specific if needed
      })
    );
  });

  it('should handle GraphQL errors', async () => {
    // Use mockFetch from beforeEach and configure it for this specific case
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        errors: [{ message: 'GraphQL Error: Test error' }]
      }),
      text: () => Promise.resolve(JSON.stringify({
        errors: [{ message: 'GraphQL Error: Test error' }]
      })),
      headers: { // Keep headers consistent or simplify if not crucial for this error test
        get: (key: string) => (key.toLowerCase() === 'content-type' ? 'application/json' : null),
        forEach: (callback: (value: string, key: string) => void) => callback('application/json', 'content-type'),
      }
    });

    await expect(client.query({
      query: '{ test }'
    })).rejects.toThrow('GraphQL Error: Test error');
  });

  it('should return pong when pinging the API', async () => {
    // Use mockFetch from beforeEach and configure it for this specific case
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: { ping: 'pong' } }),
      text: () => Promise.resolve(JSON.stringify({ data: { ping: 'pong' } })),
      headers: {
        get: (key: string) => (key.toLowerCase() === 'content-type' ? 'application/json' : null),
        forEach: (callback: (value: string, key: string) => void) => callback('application/json', 'content-type'),
      },
    });

    // No need to call vi.stubGlobal('fetch', mockFetch) again here, it's done in beforeEach

    const result = await client.ping();

    expect(result).toBe('pong');
    expect(mockFetch).toHaveBeenCalledWith(
      'https://mercury-sign.frb.io/api',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 4G6leis24EdDxmrJN7uAypEiUIDuoq7u'
        },
        body: JSON.stringify({
            query: "query Ping {\n  ping\n}", // Matches your previous update
            operationName: "Ping"
          }
        )
      })
    );
  });

  it('should create a custom query function with type safety', async () => {
    interface CustomQueryVariables {
      slug: string;
    }
    interface CustomQueryResult {
      customData: {
        id: string;
        title: string;
        customField: string;
      };
    }

    // Use the mockFetch from beforeEach and configure its response for this test
    mockFetch.mockResolvedValueOnce({ // Changed from mockResolvedValue
      ok: true,
      json: () => Promise.resolve({
        data: {
          customData: {
            id: '123',
            title: 'Test Title',
            customField: 'Custom Value'
          }
        }
      }),
      text: () => Promise.resolve(JSON.stringify({
        data: {
          customData: {
            id: '123',
            title: 'Test Title',
            customField: 'Custom Value'
          }
        }
      })),
      headers: {
        get: (key: string) => (key.toLowerCase() === 'content-type' ? 'application/json' : null),
        forEach: (callback: (value: string, key: string) => void) => callback('application/json', 'content-type'),
      },
    });

    // No need to redefine mockFetch or call vi.stubGlobal('fetch', mockFetch) again

    const getCustomData = client.createCustomQuery<CustomQueryVariables, CustomQueryResult>({
      query: `
        query GetCustomData($slug: String!) {
          customData(slug: $slug) {
            id
            title
            customField
          }
        }
      `,
      transformResponse: (data) => {
        return {
          customData: {
            ...data.customData,
            title: data.customData.title.toUpperCase()
          }
        };
      }
    });

    const result = await getCustomData({ slug: 'test-slug' });

    expect(result.customData.id).toBe('123');
    expect(result.customData.title).toBe('TEST TITLE');
    expect(result.customData.customField).toBe('Custom Value');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://mercury-sign.frb.io/api',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 4G6leis24EdDxmrJN7uAypEiUIDuoq7u'
        },
        body: expect.stringContaining('GetCustomData') // This should be fine
      })
    );
  });
});