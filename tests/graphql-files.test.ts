import { describe, it, expect, vi } from 'vitest';
import { gql } from "../src/index.js";
import { DocumentNode } from 'graphql';

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
  // Test the gql function directly without making HTTP requests

  it('should handle DocumentNode objects (imported .graphql files)', () => {
    // When a DocumentNode is passed to gql, it should return it as is
    const result = gql(mockDocumentNode);

    // Verify that the result is the same DocumentNode
    expect(result).toBe(mockDocumentNode);
    expect(result.kind).toBe('Document');
    expect(result.definitions[0].kind).toBe('OperationDefinition');
  });

  it('should handle string queries', () => {
    const stringQuery = 'query { test }';
    const result = gql(stringQuery);

    // Verify that the result is a DocumentNode
    expect(result).toBeDefined();
    expect(result.kind).toBe('Document');
    expect(result.definitions).toBeDefined();
    expect(result.definitions.length).toBeGreaterThan(0);
    expect(result.definitions[0].kind).toBe('OperationDefinition');
  });

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
});
