import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  target: 'esnext',
  outDir: 'dist',
  outExtension: () => ({ js: '.js' }),
  platform: 'node',
  treeshake: true,
  splitting: true,
  minify: false,
  keepNames: true,
});