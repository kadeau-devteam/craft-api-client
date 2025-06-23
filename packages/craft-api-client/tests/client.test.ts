import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {craftClient} from "../src/index.js";
import { gql } from 'graphql-request';


describe('CraftClient', () => {
  let client: ReturnType<typeof craftClient>;
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

    client = craftClient({
      apiKey: '4G6leis24EdDxmrJN7uAypEiUIDuoq7u',
      baseUrl: 'https://mercury-sign.frb.io/api'
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });


  it('should create a client with required configuration', () => {
    expect(client).toHaveProperty('query');
    expect(client).toHaveProperty('config');
    expect(typeof client.query).toBe('function');
    expect(client.config).toEqual({
      apiKey: '4G6leis24EdDxmrJN7uAypEiUIDuoq7u',
      baseUrl: 'https://mercury-sign.frb.io/api'
    });
  });

  it('should throw an error when apiKey is not provided', () => {
    expect(() => {
      craftClient({
        apiKey: '',
        baseUrl: 'https://example.com/api'
      });
    }).toThrow('apiKey is required');
  });

  it('should throw an error when baseUrl is not provided', () => {
    expect(() => {
      craftClient({
        apiKey: '4G6leis24EdDxmrJN7uAypEiUIDuoq7u',
        baseUrl: ''
      });
    }).toThrow('baseUrl is required');
  });


  it.skip('should make GraphQL requests with correct configuration', async () => {
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

  it.skip('should handle GraphQL errors', async () => {
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

    await expect(client.query(
      gql`{ test }`
    )).rejects.toThrow('GraphQL Error: Test error');
  });

  it('should support attaching a custom SDK', () => {
    // Create a mock SDK
    const mockSdk = {
      getEntries: vi.fn().mockResolvedValue({ data: { entries: [] } }),
      getEntry: vi.fn().mockResolvedValue({ data: { entry: {} } })
    };

    // Create a client with the SDK
    const clientWithSdk = craftClient({
      apiKey: '4G6leis24EdDxmrJN7uAypEiUIDuoq7u',
      baseUrl: 'https://mercury-sign.frb.io/api',
      sdk: mockSdk
    });

    // Check that the SDK is attached
    expect(clientWithSdk).toHaveProperty('sdk');
    expect(clientWithSdk.sdk).toBe(mockSdk);
  });

  it('should allow using the SDK methods', async () => {
    // Create a mock SDK
    const mockSdk = {
      getEntries: vi.fn().mockResolvedValue({ data: { entries: [] } }),
      getEntry: vi.fn().mockResolvedValue({ data: { entry: { id: '123', title: 'Test' } } })
    };

    // Create a client with the SDK
    const clientWithSdk = craftClient({
      apiKey: '4G6leis24EdDxmrJN7uAypEiUIDuoq7u',
      baseUrl: 'https://mercury-sign.frb.io/api',
      sdk: mockSdk
    });

    // Use the SDK method
    const result = await clientWithSdk.sdk.getEntry();

    // Check that the SDK method was called
    expect(mockSdk.getEntry).toHaveBeenCalled();
    expect(result).toEqual({ data: { entry: { id: '123', title: 'Test' } } });
  });

});
