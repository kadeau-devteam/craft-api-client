import {CraftClientConfig, createClient} from "./client.js";
import { getSdk, Sdk } from '../cms/generated/client.js';
import { gql } from 'graphql-request';

export { gql };

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
