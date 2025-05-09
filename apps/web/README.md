# Craft API Client Demo (Next.js App)

This is a Next.js application that demonstrates the usage of the craft-api-client package.

## Getting Started

### Prerequisites

- Node.js >= 20.10.0
- PNPM >= 10.5.2

### Environment Variables

Copy the `.env.example` file to `.env.local` and update the values:

```bash
cp .env.local .env.local
```

Then edit `.env.local` with your Craft CMS API credentials:

```
NEXT_PUBLIC_CRAFT_API_KEY=your-craft-api-key
NEXT_PUBLIC_CRAFT_API_URL=https://your-craft-cms-url/api
```

### Installation

```bash
# From the root of the monorepo
pnpm install
```

### Development

```bash
# From the root of the monorepo
pnpm dev

# Or specifically for this app
cd apps/web
pnpm dev
```

This will start the development server at [http://localhost:3000](http://localhost:3000).

### Building for Production

```bash
# From the root of the monorepo
pnpm build

# Or specifically for this app
cd apps/web
pnpm build
```

## Features

- Demonstrates how to use the craft-api-client in a Next.js application
- Shows how to configure environment variables for the client
- Provides a simple UI for testing the API connection

## Learn More

To learn more about the craft-api-client, check out the [craft-api-client README](../../packages/craft-api-client/README.md).

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.