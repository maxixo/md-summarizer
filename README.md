# MD Summarizer 📚

![npm version](https://img.shields.io/npm/v/%40yourname%2Fmd-summarizer)
![License](https://img.shields.io/badge/license-MIT-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

Smart markdown documentation summarizer with AI-quality analysis. No API keys, no rate limits, completely free.

## Features

- ✅ Deterministic markdown analysis with no external AI dependency
- 📚 Summarizes markdown files into one readable report
- 🧠 Extracts headings, key points, links, technical terms, and code examples
- 🛡️ Includes input validation, traversal protection, file limits, and logging
- ⚙️ Works as a local CLI for docs, handbooks, and technical repositories
- 🧪 Prepared for Jest-based unit and integration testing

## Installation

```bash
npm install -g @yourname/md-summarizer
```

## Quick Start

```bash
md-summarizer --directory . --output SUMMARY.md
```

This scans the current directory for markdown files and writes a summary report to `SUMMARY.md`.

## Usage

```bash
md-summarizer --directory docs --output SUMMARY.md --include "**/*.md" --exclude node_modules/** dist/** --grouped
```

### Command Options

- `-d, --directory <path>`: directory to scan for markdown files
- `-o, --output <filename>`: output markdown filename, for example `SUMMARY.md`
- `-i, --include <glob>`: include glob pattern, default is `**/*.md`
- `-e, --exclude <patterns...>`: one or more glob exclusion patterns
- `-g, --grouped`: group output sections by inferred complexity

## Security

The CLI includes the following security protections:

- Path traversal prevention via `InputValidator.sanitizePath()`
- Pattern injection prevention via `InputValidator.sanitizePattern()`
- Safe output filename enforcement via `InputValidator.sanitizeOutputFilename()`
- File-size and file-count limits via `SecurityConfig`
- Symlink blocking and timeout protection in `src/index.ts`
- Error logging to `.md-summarizer.log`

Detailed vulnerability-reporting guidance is available in `SECURITY.md`.

## Contributing

Contributions are welcome. Review `CONTRIBUTING.md` for development setup, testing, and pull request guidance.

## License

This project is licensed under the MIT License. See `LICENSE`.

## Support

- Issues: `https://github.com/maxixo/md-summarizer/issues`
- Security: `your.email@example.com`
- Maintainer: `Your Name`
