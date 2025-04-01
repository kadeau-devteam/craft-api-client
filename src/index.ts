export interface CraftClientConfig {
  apiKey: string;
  baseUrl?: string;
}

export class CraftClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(config: CraftClientConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl ?? 'https://api.craft.do/v1';
  }

  // Client methods will be implemented here
}

export default CraftClient;

