import { describe, it, expect, vi, beforeEach } from 'vitest';
import createCraftClient from '../src/index.js';

describe('CraftClient', () => {
  let client;

  beforeEach(() => {
    // Create a new client before each test to avoid duplicating client creation in every test
    // Each test will use this shared client instance after setting up its own mocks
    client = createCraftClient({
      apiKey: '4G6leis24EdDxmrJN7uAypEiUIDuoq7u',
      baseUrl: 'https://mercury-sign.frb.io/api'
    });
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

  it('should make GraphQL requests with correct configuration', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { test: 'data' } })
    });

    vi.stubGlobal('fetch', mockFetch);

    await client.query({
      query: 'test query',
      variables: { test: 'variable' }
    });

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
      })
    });

    vi.stubGlobal('fetch', mockFetch);

    await expect(client.query({
      query: 'test query'
    })).rejects.toThrow('GraphQL Error: Test error');
  });

  it('should handle network errors', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      statusText: 'Network Error'
    });

    vi.stubGlobal('fetch', mockFetch);

    await expect(client.query({
      query: 'test query'
    })).rejects.toThrow('GraphQL request failed: Network Error');
  });

  it('should return pong when pinging the API', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { ping: 'pong' } })
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
});
