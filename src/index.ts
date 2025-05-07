import {CraftClientConfig, createClient} from "./client.js";
import { getSdk, Sdk } from '../cms/generated/client.js';

export type CraftClient = Sdk & {
  query: ReturnType<typeof createClient>['request'];
  config: CraftClientConfig;
};

export function createCraftClient(config: CraftClientConfig): CraftClient {
  const rawClient = createClient(config);
  const sdk = getSdk(rawClient);

  return {
    ...sdk,
    query: rawClient.request.bind(rawClient),
    config: (rawClient as any).config,
  } as CraftClient;
}
