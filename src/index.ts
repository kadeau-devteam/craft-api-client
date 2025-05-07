import {CraftClientConfig, createClient} from "./client.js";
import { getSdk, Sdk } from '../cms/generated/client.js';
import { gql } from 'graphql-request';
import { DocumentNode } from 'graphql';

export { gql };

export type CraftClient = Sdk & {
  query: <T = any, V = any>(
    document: string | DocumentNode,
    variables?: V,
    requestHeaders?: Record<string, string>
  ) => Promise<T>;
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
