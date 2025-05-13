# Changelog

All notable changes to this project will be documented in this file.

## [0.0.23] - 2023-11-17

### Added
- Added `defineCraftConfig` function for type-safe configuration in craft.config.ts files
- Made `schema` and `apiKey` required configuration values
- Updated documentation to show the new usage pattern with defineCraftConfig

## [0.0.22] - 2023-11-16

### Changed
- Moved GraphQL codegen dependencies (`graphql`, `@graphql-codegen/cli`, `@graphql-codegen/client-preset`, `@graphql-codegen/schema-ast`) from peer dependencies to regular dependencies so they're automatically installed with the package.
- Updated documentation to reflect that these dependencies are now included with the package.

## [0.0.21] - 2023-11-15

### Fixed
- Added TypeScript loader for craft.config.ts files to fix the error "Missing loader for extension 'craft.config.ts'" when using the package in Next.js projects.

## [0.0.20] - 2023-11-10

### Added
- Initial release
