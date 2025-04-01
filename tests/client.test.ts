import { describe, it, expect } from 'vitest';
import { CraftClient } from '../src';

describe('CraftClient', () => {
  it('should initialize with default baseUrl', () => {
    const client = new CraftClient({ apiKey: 'test-key' });
    expect(client).toBeInstanceOf(CraftClient);
  });

  it('should initialize with custom baseUrl', () => {
    const client = new CraftClient({
      apiKey: 'test-key',
      baseUrl: 'https://custom-api.example.com'
    });
    expect(client).toBeInstanceOf(CraftClient);
  });
});

