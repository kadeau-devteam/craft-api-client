import { defineConfig } from 'craft-api-client/config';

export default defineConfig({
  // The URL or local file path to the GraphQL schema (required)
  schema: process.env.CRAFT_API_URL as string,

  // API key for authentication (required)
  apiKey: process.env.CRAFT_API_KEY as string,

  // Glob pattern(s) for your GraphQL documents (optional)
  documents: [
    'src/graphql/**/*.{ts,tsx,js,jsx,graphql,astro}',
    'app/**/*.{ts,tsx,js,jsx,graphql,astro}',
    '!**/node_modules/**'
  ],

  // The output directory for generated files (optional)
  output: './src/generated/craft-api/',
});