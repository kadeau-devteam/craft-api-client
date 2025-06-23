import { defineConfig } from 'craft-api-client/config';

export default defineConfig({
  // The URL to the Craft CMS GraphQL API (required)
  baseUrl: process.env.CRAFT_API_URL as string,

  // API key for authentication (required)
  apiKey: process.env.CRAFT_API_KEY as string,
});
