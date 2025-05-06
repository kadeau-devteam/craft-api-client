import { describe, it, expect, beforeAll } from 'vitest';
import createCraftClient from '../src/index.js';

// Define the expected result structure for the custom query
interface CustomTestResult {
  customTest: {
    success: boolean;
    message: string;
  };
}

// Mock the GraphQLClient to avoid actual network requests
vi.mock('graphql-request', () => {
  return {
    GraphQLClient: vi.fn().mockImplementation(() => {
      return {
        request: vi.fn().mockImplementation((query) => {
          // Check if this is our custom query
          if (query.includes('CustomTestQuery')) {
            return Promise.resolve({
              customTest: {
                success: true,
                message: 'Custom query works!'
              }
            });
          }

          // Default mock response for other queries
          return Promise.resolve({
            ping: 'pong'
          });
        })
      };
    })
  };
});

describe('Custom Query Support', () => {
  let client: ReturnType<typeof createCraftClient>;

  beforeAll(() => {
    client = createCraftClient({
      apiKey: 'test-api-key',
      baseUrl: 'https://test-craft-site.com/api'
    });
  });

  it('should support custom queries using createCustomQuery', async () => {
    // This is the existing way to create custom queries
    const customQuery = client.createCustomQuery<Record<string, never>, CustomTestResult>({
      query: `
        query CustomTestQuery {
          customTest {
            success
            message
          }
        }
      `
    });

    const result = await customQuery({});
    expect(result).toHaveProperty('customTest');
    expect(result.customTest).toHaveProperty('success', true);
    expect(result.customTest).toHaveProperty('message', 'Custom query works!');
  });

  it('should explain how to use the new custom query feature', () => {
    // This test is just documentation for how the new feature would be used
    console.log(`
      To use custom GraphQL queries with code generation:

      1. Create a directory for your custom GraphQL queries:
         src/graphql/queries/customQuery.graphql

      2. Add your GraphQL query to the file:
         query CustomQuery($param: String!) {
           customData(param: $param) {
             id
             title
           }
         }

      3. Run the code generation with your custom queries:
         CUSTOM_DOCUMENTS="./src/graphql/queries/**/*.graphql" pnpm codegen:with-custom

      4. The generated SDK will include your custom query:
         const result = await client.sdk.CustomQuery({ param: 'value' });
    `);

    // This is a placeholder assertion since this test is just documentation
    expect(true).toBe(true);
  });
});
