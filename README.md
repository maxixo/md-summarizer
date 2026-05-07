# MD Summarizer

![npm version](https://img.shields.io/npm/v/md-summarizer)
![License](https://img.shields.io/badge/license-MIT-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

Deterministic CLI for summarizing Markdown documentation locally. No API keys or hosted AI services are required.

## Features

- Deterministic Markdown analysis with no external service dependency
- Single-command report generation for docs, handbooks, and technical repositories
- Extraction of headings, key points, links, technical terms, and code examples
- Built-in input validation, traversal protection, file limits, and error logging
- Jest-based unit and integration test coverage

## Requirements

- Node.js 18 or newer

## Installation

```bash
npm install -g md-summarizer
```

Or install it locally in a project:

```bash
npm i md-summarizer
```

## Quick Start

```bash
md-sm --directory . --output SUMMARY.md
```

This scans the current directory for Markdown files and writes a summary report to `SUMMARY.md`.

## Usage

```bash
md-sm --directory docs --output SUMMARY.md --include "**/*.md" --exclude node_modules/** dist/** --grouped
```

### Command Options

- `-d, --directory <path>`: directory to scan for Markdown files
- `-o, --output <filename>`: output Markdown filename, for example `SUMMARY.md`
- `-i, --include <glob>`: include glob pattern, default is `**/*.md`
- `-e, --exclude <patterns...>`: one or more glob exclusion patterns
- `-g, --grouped`: group output sections by inferred complexity

## Security

The CLI includes the following protections:

- Path traversal prevention via `InputValidator.sanitizePath()`
- Pattern sanitization via `InputValidator.sanitizePattern()`
- Safe output filename enforcement via `InputValidator.sanitizeOutputFilename()`
- File-size and file-count limits via `SecurityConfig`
- Symlink blocking and timeout protection in `src/index.ts`
- Error logging to `.md-sm.log`

Detailed vulnerability-reporting guidance is available at:
`https://github.com/maxixo/md-summarizer/blob/main/security.md`

## Contributing

Contributions are welcome. Review `CONTRIBUTING.md` for development setup, testing, and release guidance.

## License

This project is licensed under the MIT License. See `LICENSE`.

## Support

- Issues: `https://github.com/maxixo/md-summarizer/issues`
- Security: `oshodiusman@yahoo.com`
- Maintainer: `Usman Oshodi`
