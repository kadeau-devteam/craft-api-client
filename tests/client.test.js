import { describe, it, expect, vi } from 'vitest';
import createCraftClient from '../src';
describe('CraftClient', () => {
    it('should create a client with required configuration', () => {
        const client = createCraftClient({
            apiKey: 'test-key',
            baseUrl: 'https://api.example.com'
        });
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
        const client = createCraftClient({
            apiKey: 'test-key',
            baseUrl: 'https://api.example.com'
        });
        await client.query({
            query: 'test query',
            variables: { test: 'variable' }
        });
        expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/graphql', expect.objectContaining({
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer test-key'
            },
            body: expect.any(String)
        }));
    });
    it('should handle GraphQL errors', async () => {
        const mockFetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({
                errors: [{ message: 'Test error' }]
            })
        });
        vi.stubGlobal('fetch', mockFetch);
        const client = createCraftClient({
            apiKey: 'test-key',
            baseUrl: 'https://api.example.com'
        });
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
        const client = createCraftClient({
            apiKey: 'test-key',
            baseUrl: 'https://api.example.com'
        });
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
        const client = createCraftClient({
            apiKey: 'test-key',
            baseUrl: 'https://api.example.com'
        });
        const result = await client.ping();
        expect(result).toBe('pong');
        expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/graphql', expect.objectContaining({
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer test-key'
            },
            body: JSON.stringify({ query: '{ ping }' })
        }));
    });
});
