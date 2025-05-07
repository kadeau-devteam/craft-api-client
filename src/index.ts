import {CraftClientConfig, createClient} from "./client.js";
import { getSdk, Sdk } from '../cms/generated/client.js';
import { gql as originalGql } from 'graphql-request';
import { DocumentNode, parse } from 'graphql';

/**
 * Enhanced version of the gql tag that supports:
 * 1. Template literals (standard gql usage)
 * 2. DocumentNode objects (from imported .graphql files)
 * 3. Plain strings
 * 
 * This allows users to import GraphQL queries from files and use them directly with the client.
 * 
 * @example
 * ```typescript
 * // Using template literals
 * const query1 = gql`query { ... }`;
 * 
 * // Using imported .graphql files
 * import destinationsQuery from './queries/destinations.graphql';
 * const result = await client.query(destinationsQuery);
 * ```
 */
export function gql(literals: TemplateStringsArray | string | DocumentNode, ...placeholders: any[]): DocumentNode {
  // If it's already a DocumentNode (like an imported .graphql file), return it as is
  if (typeof literals === 'object' && literals !== null && 'kind' in literals && literals.kind === 'Document') {
    return literals as DocumentNode;
  }

  try {
    let queryString: string;

    // If it's a string, use it directly
    if (typeof literals === 'string') {
      queryString = literals;
    } 
    // If it's a template literal, concatenate it
    else if (Array.isArray(literals) && 'raw' in literals) {
      const templateArray = literals as TemplateStringsArray;
      queryString = templateArray.reduce((acc, str, i) => {
        return acc + str + (placeholders[i] || '');
      }, '');
    }
    // Handle other cases
    else {
      throw new Error('Invalid argument type passed to gql');
    }

    // Parse the query string into a DocumentNode
    return parse(queryString);
  } catch (error) {
    console.error('Error parsing GraphQL query:', error);
    throw error;
  }
}

export type CraftClient = Sdk & {
  query: ReturnType<typeof createClient>['request'];
  config: CraftClientConfig;
};

export function craftClient(config: CraftClientConfig): CraftClient {
  const rawClient = createClient(config);
  const sdk = getSdk(rawClient);

  return {
    ...sdk,
    query: rawClient.request.bind(rawClient),
    config: (rawClient as any).config,
  } as CraftClient;
}

export default craftClient;
