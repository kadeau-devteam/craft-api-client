import { defineConfig, configDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      exclude: [...configDefaults.coverage.exclude, 'tests/integration/**']
    },
    testTimeout: 10000, // Longer timeout for integration tests
    environmentOptions: {
      // You can add specific environment options here if needed
    }
  }
});
