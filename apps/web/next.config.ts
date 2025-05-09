import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["craft-api-client"],
  // Ensure Next.js uses the ESM version of the package
  experimental: {
    esmExternals: true
  },
  webpack: (config) => {
    // Add a rule for .graphql files
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'graphql-tag/loader'
        }
      ]
    });

    return config;
  }
};

export default nextConfig;