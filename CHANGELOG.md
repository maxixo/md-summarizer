# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog.

## [Unreleased]

### Added

- Jest-based testing scaffolding through [`jest.config.js`](jest.config.js)
- Security-focused validator and integration coverage in [`tests/security.test.ts`](tests/security.test.ts) and [`tests/integration.test.ts`](tests/integration.test.ts)
- CI workflow drafts in [`.github/workflows/test.yml`](.github/workflows/test.yml) and related automation files

### Changed

- Publishing metadata, docs, and package scripts in [`package.json`](package.json)

### Fixed

- N/A

### Security

- Added validation, throttling, timeout, logging, and filesystem protections in [`src/index.ts`](src/index.ts)

## [1.0.0]

### Added

- Stable TypeScript CLI release for markdown summarization
- Deterministic content analysis in [`ContentAnalyzer.analyze()`](src/analyzers/content-analyzer.ts:86)
- Markdown report generation in [`SummaryGenerator.generateDocument()`](src/generators/summary-generator.ts:13)

### Changed

- Packaged the CLI for npm distribution

### Fixed

- Improved consistency of summary output ordering

### Security

- Added baseline hardening controls for user input and filesystem access

## [0.1.0-beta.1]

### Added

- Initial beta CLI structure

### Changed

- N/A

### Fixed

- N/A

### Security

- N/A
