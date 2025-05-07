import { createClient, CraftClientConfig } from './client.js';
import * as generated from './generated/client.js'; // automatski generirano

export function createCraftClient(config: CraftClientConfig) {
  const rawClient = createClient(config);

  const methods = Object.entries(generated).reduce((acc, [key, fn]) => {
    acc[key] = (variables: any) => fn(rawClient, variables);
    return acc;
  }, {} as Record<string, any>);

  return {
    ...methods,
    query: rawClient.request.bind(rawClient),
  };
}
