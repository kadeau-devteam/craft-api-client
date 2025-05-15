import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { existsSync } from 'fs';
import { join, resolve } from 'path';
import { execSync } from 'child_process';

// Import modules to mock
import * as fs from 'fs';
import * as graphqlCodegen from '@graphql-codegen/cli';
import * as lilconfigModule from 'lilconfig';

// Mock modules
vi.mock('fs');
vi.mock('path');
vi.mock('child_process');
vi.mock('@graphql-codegen/cli');
vi.mock('lilconfig');

// Setup mock implementations
vi.mocked(graphqlCodegen.generate).mockResolvedValue(undefined);

// Mock lilconfig to return a mock configuration
vi.mocked(lilconfigModule.lilconfig).mockImplementation(() => {
  return {
    search: vi.fn().mockResolvedValue({
      config: {
        schema: 'https://example.com/graphql',
        apiKey: 'test-api-key',
        documents: ['src/**/*.graphql'],
        output: './src/generated/'
      }
    })
  };
});

// Import the module after mocking
import { generate } from '@graphql-codegen/cli';

describe('craft-codegen', () => {
  const tempDir = resolve(__dirname, 'temp-test-dir');
  const craftConfigPath = join(tempDir, 'craft.config.ts');
  const envFilePath = join(tempDir, '.env');

  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks();

    // Mock process.cwd to return our temp directory
    vi.spyOn(process, 'cwd').mockReturnValue(tempDir);

    // Mock existsSync for different files
    vi.mocked(existsSync).mockImplementation((path) => {
      if (path === craftConfigPath) return true; // craft.config.ts exists
      if (path === envFilePath) return true; // .env exists
      return false; // Other files don't exist
    });

    // Mock readFileSync for craft.config.ts
    vi.mocked(fs.readFileSync).mockImplementation((path: any) => {
      if (path === craftConfigPath) {
        return `
          import { defineConfig } from '../src/craft-codegen';

          export default defineConfig({
            schema: 'https://example.com/graphql',
            apiKey: 'test-api-key',
            documents: ['src/**/*.graphql'],
            output: './src/generated/'
          });
        `;
      }
      if (path === envFilePath) {
        return 'CRAFT_API_KEY=env-api-key\nCRAFT_GRAPHQL_SCHEMA=https://env-example.com/graphql';
      }
      return '';
    });

    // Mock resolve to return the input path (simplified for testing)
    vi.mocked(resolve).mockImplementation((...args) => args.join('/'));

    // Mock join to concatenate paths (simplified for testing)
    vi.mocked(join).mockImplementation((...args) => args.join('/'));

    // Default lilconfig mock
    vi.mocked(lilconfigModule.lilconfig).mockImplementation(() => {
      return {
        search: vi.fn().mockResolvedValue({
          config: {
            schema: 'https://example.com/graphql',
            apiKey: 'test-api-key',
            documents: ['src/**/*.graphql'],
            output: './src/generated/'
          }
        })
      };
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.skip('should load configuration from craft.config.ts', async () => {
    // Import the module dynamically to ensure mocks are applied
    const craftCodegenModule = await import('../src/craft-codegen');

    // Call the main function
    await craftCodegenModule.default();

    // Check that generate was called with the correct config
    expect(generate).toHaveBeenCalledWith(
      expect.objectContaining({
        generates: expect.objectContaining({
          [join('./src/generated/', 'schema.graphql')]: expect.objectContaining({
            schema: expect.objectContaining({
              'https://example.com/graphql': expect.objectContaining({
                headers: expect.objectContaining({
                  'Authorization': 'Bearer test-api-key'
                })
              })
            })
          }),
          './src/generated/': expect.objectContaining({
            documents: ['src/**/*.graphql'],
            preset: 'client'
          })
        })
      }),
      true
    );
  });

  it.skip('should fall back to environment variables when config values are missing', async () => {
    // Mock readFileSync for craft.config.ts with missing values
    // Note: We're using the old pattern (simple object export) for testing fallback behavior
    // since defineConfig would throw an error if schema or apiKey are missing
    vi.mocked(fs.readFileSync).mockImplementation((path: any) => {
      if (path === craftConfigPath) {
        return `
          export default {
            // No schema or apiKey
            documents: ['src/**/*.graphql'],
            output: './src/generated/'
          };
        `;
      }
      if (path === envFilePath) {
        return 'CRAFT_API_KEY=env-api-key\nCRAFT_GRAPHQL_SCHEMA=https://env-example.com/graphql';
      }
      return '';
    });

    // Mock lilconfig to return config without schema and apiKey
    vi.mocked(lilconfigModule.lilconfig).mockImplementation(() => {
      return {
        search: vi.fn().mockResolvedValue({
          config: {
            // No schema or apiKey
            documents: ['src/**/*.graphql'],
            output: './src/generated/'
          }
        })
      };
    });

    // Set environment variables
    process.env.CRAFT_API_KEY = 'env-api-key';
    process.env.CRAFT_GRAPHQL_SCHEMA = 'https://env-example.com/graphql';

    // Import the module dynamically to ensure mocks are applied
    const craftCodegenModule = await import('../src/craft-codegen');

    // Call the main function
    await craftCodegenModule.default();

    // Check that generate was called with the correct config using env vars
    expect(generate).toHaveBeenCalledWith(
      expect.objectContaining({
        generates: expect.objectContaining({
          [join('./src/generated/', 'schema.graphql')]: expect.objectContaining({
            schema: expect.objectContaining({
              'https://env-example.com/graphql': expect.objectContaining({
                headers: expect.objectContaining({
                  'Authorization': 'Bearer env-api-key'
                })
              })
            })
          })
        })
      }),
      true
    );

    // Clean up environment variables
    delete process.env.CRAFT_API_KEY;
    delete process.env.CRAFT_GRAPHQL_SCHEMA;
  });

  it.skip('should use default values when config values are missing but required ones are provided', async () => {
    // Mock readFileSync for craft.config.ts with only required fields
    vi.mocked(fs.readFileSync).mockImplementation((path: any) => {
      if (path === craftConfigPath) {
        return `
          export default {
            schema: 'https://example.com/graphql',
            apiKey: 'test-api-key',
            // No documents or output
          };
        `;
      }
      // No .env file
      return '';
    });

    // Mock existsSync to return false for .env
    vi.mocked(existsSync).mockImplementation((path) => {
      if (path === craftConfigPath) return true; // craft.config.ts exists
      return false; // Other files don't exist
    });

    // Mock lilconfig to return config with only required fields
    vi.mocked(lilconfigModule.lilconfig).mockImplementation(() => {
      return {
        search: vi.fn().mockResolvedValue({
          config: {
            schema: 'https://example.com/graphql',
            apiKey: 'test-api-key',
            // No documents or output
          }
        })
      };
    });

    // Import the module dynamically to ensure mocks are applied
    const craftCodegenModule = await import('../src/craft-codegen');

    // Call the main function
    await craftCodegenModule.default();

    // Check that generate was called with the correct config using defaults
    expect(generate).toHaveBeenCalledWith(
      expect.objectContaining({
        generates: expect.objectContaining({
          [join('./src/generated/craft-api/', 'schema.graphql')]: expect.any(Object),
          './src/generated/craft-api/': expect.objectContaining({
            documents: expect.arrayContaining([
              'src/**/*.{ts,tsx,js,jsx,graphql,astro}',
              'app/**/*.{ts,tsx,js,jsx,graphql,astro}',
              '!**/node_modules/**'
            ])
          })
        })
      }),
      true
    );
  });

  it.skip('should throw an error when schema is not provided', async () => {
    // Mock readFileSync for craft.config.ts with no schema
    vi.mocked(fs.readFileSync).mockImplementation((path: any) => {
      if (path === craftConfigPath) {
        return `
          export default {
            // No schema
            apiKey: 'test-api-key',
            documents: ['src/**/*.graphql'],
            output: './src/generated/'
          };
        `;
      }
      // No .env file
      return '';
    });

    // Mock existsSync to return false for .env
    vi.mocked(existsSync).mockImplementation((path) => {
      if (path === craftConfigPath) return true; // craft.config.ts exists
      return false; // Other files don't exist
    });

    // Mock lilconfig to return config without schema
    vi.mocked(lilconfigModule.lilconfig).mockImplementation(() => {
      return {
        search: vi.fn().mockResolvedValue({
          config: {
            // No schema
            apiKey: 'test-api-key',
            documents: ['src/**/*.graphql'],
            output: './src/generated/'
          }
        })
      };
    });

    // Mock process.exit
    const mockExit = vi.spyOn(process, 'exit').mockImplementation((code) => {
      throw new Error(`Process exited with code ${code}`);
    });

    // Mock console.error
    const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Import the module dynamically to ensure mocks are applied
    const craftCodegenModule = await import('../src/craft-codegen');

    // Call the main function and expect it to throw
    await expect(craftCodegenModule.default()).rejects.toThrow('Process exited with code 1');

    // Check that console.error was called with the correct message
    expect(mockConsoleError).toHaveBeenCalledWith(
      expect.stringContaining('schema is required')
    );

    // Restore mocks
    mockExit.mockRestore();
    mockConsoleError.mockRestore();
  });

  it.skip('should throw an error when apiKey is not provided', async () => {
    // Mock readFileSync for craft.config.ts with no apiKey
    vi.mocked(fs.readFileSync).mockImplementation((path: any) => {
      if (path === craftConfigPath) {
        return `
          export default {
            schema: 'https://example.com/graphql',
            // No apiKey
            documents: ['src/**/*.graphql'],
            output: './src/generated/'
          };
        `;
      }
      // No .env file
      return '';
    });

    // Mock existsSync to return false for .env
    vi.mocked(existsSync).mockImplementation((path) => {
      if (path === craftConfigPath) return true; // craft.config.ts exists
      return false; // Other files don't exist
    });

    // Mock lilconfig to return config without apiKey
    vi.mocked(lilconfigModule.lilconfig).mockImplementation(() => {
      return {
        search: vi.fn().mockResolvedValue({
          config: {
            schema: 'https://example.com/graphql',
            // No apiKey
            documents: ['src/**/*.graphql'],
            output: './src/generated/'
          }
        })
      };
    });

    // Mock process.exit
    const mockExit = vi.spyOn(process, 'exit').mockImplementation((code) => {
      throw new Error(`Process exited with code ${code}`);
    });

    // Mock console.error
    const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Import the module dynamically to ensure mocks are applied
    const craftCodegenModule = await import('../src/craft-codegen');

    // Call the main function and expect it to throw
    await expect(craftCodegenModule.default()).rejects.toThrow('Process exited with code 1');

    // Check that console.error was called with the correct message
    expect(mockConsoleError).toHaveBeenCalledWith(
      expect.stringContaining('apiKey is required')
    );

    // Restore mocks
    mockExit.mockRestore();
    mockConsoleError.mockRestore();
  });

  it.skip('should use override config when provided', async () => {
    // Mock process.argv to include --config flag
    vi.spyOn(process, 'argv', 'get').mockReturnValue([
      'node', 'craft-codegen', '--config', 'custom-codegen.ts'
    ]);

    // Mock existsSync to return true for custom config
    vi.mocked(existsSync).mockImplementation((path) => {
      return !!path.includes('custom-codegen.ts');

    });

    // Import the module dynamically to ensure mocks are applied
    const craftCodegenModule = await import('../src/craft-codegen');

    // Call the main function
    await craftCodegenModule.default();

    // Check that execSync was called with the correct command
    expect(execSync).toHaveBeenCalledWith(
      'npx graphql-codegen --config custom-codegen.ts',
      expect.objectContaining({ stdio: 'inherit' })
    );
  });
});
