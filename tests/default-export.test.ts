import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import craftClient, { createCraftClient } from "../src/index.js";

describe('Default Export', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { ping: 'pong' } }),
      text: () => Promise.resolve(JSON.stringify({ data: { ping: 'pong' } })),
      headers: {
        get: (key: string) => (key.toLowerCase() === 'content-type' ? 'application/json' : null),
        forEach: (callback: (value: string, key: string) => void) => callback('application/json', 'content-type'),
      },
    });
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should export createCraftClient', () => {
    expect(createCraftClient).toBeDefined();
    expect(typeof createCraftClient).toBe('function');
  });

  it('should export craftClient as default export', () => {
    expect(craftClient).toBeDefined();
    expect(typeof craftClient).toBe('function');
    expect(craftClient).toBe(createCraftClient);
  });

  it('should create a client using the default export', () => {
    const client = craftClient({
      apiKey: 'test-api-key',
      baseUrl: 'https://test-craft-site.com/api'
    });

    expect(client).toHaveProperty('query');
    expect(client).toHaveProperty('ping');
    expect(client).toHaveProperty('config');
    expect(client.config).toEqual({
      apiKey: 'test-api-key',
      baseUrl: 'https://test-craft-site.com/api'
    });
  });
});
