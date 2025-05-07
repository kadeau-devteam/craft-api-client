import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {createCraftClient} from "../src/index.js";
import { gql } from 'graphql-request';


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
    // Restore the original fetch function
    vi.restoreAllMocks();
  });


  it('should create a client with required configuration', () => {
    expect(client).toHaveProperty('query');
    expect(client).toHaveProperty('ping');
    expect(client).toHaveProperty('config');
    expect(typeof client.query).toBe('function');
    expect(typeof client.ping).toBe('function');
    expect(client.config).toEqual({
      apiKey: '4G6leis24EdDxmrJN7uAypEiUIDuoq7u',
      baseUrl: 'https://mercury-sign.frb.io/api'
    });
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
    await client.query(
      gql`{ test }`,
      { test: 'variable' }
    );

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
    // Configure the mock to return a GraphQL error response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        errors: [{ message: 'GraphQL Error: Test error' }]
      }),
      text: () => Promise.resolve(JSON.stringify({
        errors: [{ message: 'GraphQL Error: Test error' }]
      })),
      headers: {
        get: (key: string) => (key.toLowerCase() === 'content-type' ? 'application/json' : null),
        forEach: (callback: (value: string, key: string) => void) => callback('application/json', 'content-type'),
      }
    });

    // The query should throw an error because of the GraphQL error in the response
    await expect(client.query(
      gql`{ test }`
    )).rejects.toThrow();
  });

  it('should return pong when pinging the API', async () => {
    // Configure the mock to return a ping response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: { ping: 'pong' } }),
      text: () => Promise.resolve(JSON.stringify({ data: { ping: 'pong' } })),
      headers: {
        get: (key: string) => (key.toLowerCase() === 'content-type' ? 'application/json' : null),
        forEach: (callback: (value: string, key: string) => void) => callback('application/json', 'content-type'),
      },
    });

    // Call the ping method
    const result = await client.ping();

    // Verify the result
    expect(result.ping).toBe('pong');

    // Verify that fetch was called with the correct arguments
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
});
