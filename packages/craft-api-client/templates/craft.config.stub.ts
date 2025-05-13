/**
 * This is a template for the craft.config.ts file that can be used by apps
 * that use the craft-api-client package.
 * 
 * Usage:
 * 1. Copy this file to your project root
 * 2. Rename it to craft.config.ts
 * 3. Customize the configuration as needed
 */

export default {
  // The URL or local file path to the GraphQL schema (mandatory)
  schema: 'https://your-craft-site.com/api/graphql',

  // API key for authentication (optional)
  apiKey: 'your-api-key',

  // Glob pattern(s) for your GraphQL documents (optional)
  documents: [
    'src/**/*.{ts,tsx,js,jsx,graphql,astro}',
    'app/**/*.{ts,tsx,js,jsx,graphql,astro}',
    '!**/node_modules/**'
  ],

  // The output directory for generated files (optional)
  output: './src/generated/craft-api/',
};