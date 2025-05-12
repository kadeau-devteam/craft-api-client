import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules', '.next'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules', '.next', '**/*.d.ts', '**/*.test.{ts,tsx}', 'src/test'],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      'craft-api-client': resolve(__dirname, '../../packages/craft-api-client/src/index.ts'),
      'craft-api-client/preview': resolve(__dirname, '../../packages/craft-api-client/src/preview.ts'),
      '../graphql/getPages.graphql': resolve(__dirname, './src/test/graphql/getPages.graphql'),
    },
  },
});
