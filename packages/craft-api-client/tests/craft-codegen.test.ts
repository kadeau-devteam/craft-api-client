import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { existsSync, mkdirSync, writeFileSync, unlinkSync, rmdirSync } from 'fs';
import { join, resolve } from 'path';
import { execSync } from 'child_process';

// Mock modules
vi.mock('fs', async () => {
  const actual = await vi.importActual('fs');
  return {
    ...actual,
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
    mkdirSync: vi.fn(),
  };
});

vi.mock('path', async () => {
  const actual = await vi.importActual('path');
  return {
    ...actual,
    resolve: vi.fn(),
    join: vi.fn(),
  };
});

vi.mock('child_process', () => ({
  execSync: vi.fn(),
}));

vi.mock('@graphql-codegen/cli', () => ({
  generate: vi.fn().mockResolvedValue(undefined),
}));

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
    vi.mocked(require('fs').readFileSync).mockImplementation((path) => {
      if (path === craftConfigPath) {
        return `
          export default {
            schema: 'https://example.com/graphql',
            apiKey: 'test-api-key',
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
    
    // Mock resolve to return the input path (simplified for testing)
    vi.mocked(resolve).mockImplementation((...args) => args.join('/'));
    
    // Mock join to concatenate paths (simplified for testing)
    vi.mocked(join).mockImplementation((...args) => args.join('/'));
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  it('should load configuration from craft.config.ts', async () => {
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
  
  it('should fall back to environment variables when config values are missing', async () => {
    // Mock readFileSync for craft.config.ts with missing values
    vi.mocked(require('fs').readFileSync).mockImplementation((path) => {
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
  });
  
  it('should use default values when config values and env vars are missing', async () => {
    // Mock readFileSync for craft.config.ts with only schema
    vi.mocked(require('fs').readFileSync).mockImplementation((path) => {
      if (path === craftConfigPath) {
        return `
          export default {
            schema: 'https://example.com/graphql',
            // No apiKey, documents, or output
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
  
  it('should throw an error when schema is not provided', async () => {
    // Mock readFileSync for craft.config.ts with no schema
    vi.mocked(require('fs').readFileSync).mockImplementation((path) => {
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
  
  it('should use override config when provided', async () => {
    // Mock process.argv to include --config flag
    vi.spyOn(process, 'argv', 'get').mockReturnValue([
      'node', 'craft-codegen', '--config', 'custom-codegen.ts'
    ]);
    
    // Mock existsSync to return true for custom config
    vi.mocked(existsSync).mockImplementation((path) => {
      if (path.includes('custom-codegen.ts')) return true;
      return false;
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