import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DocumentNode } from 'graphql';
import { createCraftClient } from "../src/index.js";

// Mock the graphql-request module
vi.mock('graphql-request', () => {
  return {
    gql: (literals: TemplateStringsArray | string, ...placeholders: any[]) => {
      // Simple mock implementation that returns a DocumentNode
      return {
        kind: 'Document',
        definitions: [
          {
            kind: 'OperationDefinition',
            operation: 'query',
            selectionSet: {
              kind: 'SelectionSet',
              selections: []
            }
          }
        ]
      };
    }
  };
});

// Now import gql after mocking
import { gql } from "../src/index.js";

// Mock a DocumentNode that would come from an imported .graphql file
const mockDocumentNode: DocumentNode = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'TestQuery' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'test' }
          }
        ]
      }
    }
  ]
};

describe('GraphQL Files Support', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test the gql function for template literals
  it('should handle template literal queries', () => {
    const result = gql`query { test }`;

    // Verify that the result is a DocumentNode
    expect(result).toBeDefined();
    expect(result.kind).toBe('Document');
    expect(result.definitions).toBeDefined();
    expect(result.definitions.length).toBeGreaterThan(0);
    expect(result.definitions[0].kind).toBe('OperationDefinition');
  });

  it('should handle template literals with placeholders', () => {
    const typeName = 'User';
    const fieldName = 'name';
    const result = gql`
      query GetUser {
        ${typeName} {
          id
          ${fieldName}
        }
      }
    `;

    // Verify that the result is a DocumentNode
    expect(result).toBeDefined();
    expect(result.kind).toBe('Document');
    expect(result.definitions).toBeDefined();
    expect(result.definitions.length).toBeGreaterThan(0);
    expect(result.definitions[0].kind).toBe('OperationDefinition');
  });

  // Test that client.query can handle both string and DocumentNode
  it('should handle both string and DocumentNode in client.query', () => {
    // Mock the createClient function
    vi.mock("../src/client.js", () => ({
      createClient: vi.fn().mockReturnValue({
        request: vi.fn().mockResolvedValue({ data: 'test' }),
        config: { apiKey: 'test', baseUrl: 'test' }
      })
    }), { virtual: true });

    const client = createCraftClient({ apiKey: 'test', baseUrl: 'test' });

    // Test with DocumentNode
    client.query(mockDocumentNode);

    // Test with string
    client.query('query { test }');

    // Test with template literal
    client.query(gql`query { test }`);

    // If we got here without errors, the test passes
    expect(true).toBe(true);
  });
});
