import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import createCraftClient from '../src/index.js';

describe('CraftClient', () => {
  let client: ReturnType<typeof createCraftClient>;
  let mockFetch: typeof fetch;

  beforeEach(() => {
    mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { test: 'value' } }),
      text: () => Promise.resolve(JSON.stringify({ data: { test: 'value' } })),
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

    // Create a new client before each test to avoid duplicating client creation in every test
    // Each test will use this shared client instance after setting up its own mocks
    client = createCraftClient({
      apiKey: '4G6leis24EdDxmrJN7uAypEiUIDuoq7u',
      baseUrl: 'https://mercury-sign.frb.io/api'
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });


  it('should create a client with required configuration', () => {
    // Check if client has required methods
    expect(client).toHaveProperty('query');
    expect(client).toHaveProperty('ping');
    expect(client).toHaveProperty('getEntries');
    expect(client).toHaveProperty('getEntry');

    // Check if methods are functions
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

  it('should call fetch when query is run', async () => {
    await client.query({ query: '{ test }' });
    expect(mockFetch).toHaveBeenCalled();
  });


  it('should make GraphQL requests with correct configuration', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { test: 'data' } }),
      text: () => Promise.resolve(JSON.stringify({ data: { test: 'data' } })),
      headers: {
        forEach: () => {},
      },
    });

    // Stub fetch BEFORE creating the client
    vi.stubGlobal('fetch', mockFetch);

    // Now create the client, after fetch is mocked
    client = createCraftClient({
      apiKey: '4G6leis24EdDxmrJN7uAypEiUIDuoq7u',
      baseUrl: 'https://mercury-sign.frb.io/api'
    });

    await client.query({
      query: '{ test }', // ✅ Valid GraphQL
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
        body: expect.any(String)
      })
    );
  });

  it('should handle GraphQL errors', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ 
        errors: [{ message: 'Test error' }] 
      }),
      text: () => Promise.resolve(JSON.stringify({ 
        errors: [{ message: 'Test error' }] 
      })),
      headers: {
        forEach: () => {},
      },
    });

    vi.stubGlobal('fetch', mockFetch);

    await expect(client.query({
      query: '{ test }'
    })).rejects.toThrow('GraphQL Error: Test error');
  });

  it('should handle network errors', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      statusText: 'Network Error',
      text: () => Promise.resolve('Network Error'),
      headers: {
        forEach: () => {},
      },
    });

    vi.stubGlobal('fetch', mockFetch);

    await expect(client.query({
      query: '{ test }'
    })).rejects.toThrow('GraphQL request failed: Network Error');
  });

  it('should return pong when pinging the API', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { ping: 'pong' } }),
      text: () => Promise.resolve(JSON.stringify({ data: { ping: 'pong' } })),
      headers: {
        forEach: () => {},
      },
    });

    vi.stubGlobal('fetch', mockFetch);

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
        body: JSON.stringify({ query: '{ ping }' })
      })
    );
  });

  it('should create a custom query function with type safety', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
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
        forEach: () => {},
      },
    });

    vi.stubGlobal('fetch', mockFetch);

    // Define types for the custom query
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

    // Create a custom query function
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
        // Add a transformation to test that functionality
        return {
          customData: {
            ...data.customData,
            title: data.customData.title.toUpperCase()
          }
        };
      }
    });

    // Use the custom query function
    const result = await getCustomData({ slug: 'test-slug' });

    // Check the result
    expect(result.customData.id).toBe('123');
    expect(result.customData.title).toBe('TEST TITLE'); // Should be uppercase due to transformation
    expect(result.customData.customField).toBe('Custom Value');

    // Check that the request was made correctly
    expect(mockFetch).toHaveBeenCalledWith(
      'https://mercury-sign.frb.io/api',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 4G6leis24EdDxmrJN7uAypEiUIDuoq7u'
        },
        body: expect.stringContaining('GetCustomData')
      })
    );
  });
});
