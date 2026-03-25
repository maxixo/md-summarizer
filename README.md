# md-summarizer

`md-summarizer` is a TypeScript-based Node.js CLI that scans markdown files and generates a deterministic summary report using rule-based heuristics instead of AI.

## Features

- Discovers markdown files with glob patterns
- Performs deterministic token and sentence analysis with `marked`
- Extracts summaries, key points, technical details, headings, code examples, and links
- Infers complexity and likely audience for each document
- Produces stable markdown output that can be committed or shared

## Non-AI Approach

This project does not call language models. Summaries are built from scored sentences and structured markdown signals such as headings, list items, inline code, fenced code blocks, and important keywords.

## Installation

### From source

```bash
npm install
npm run build
```

### Run locally

```bash
node ./bin/cli.js --directory . --output SUMMARY.md
```

## Development

```bash
npm install
npm run build
npm start -- --directory . --grouped
```

## Usage

```bash
md-summarizer --directory docs --output docs/SUMMARY.md --include "**/*.md" --exclude node_modules/** dist/** --grouped
```

## CLI Options

- `-d, --directory <path>`: directory to scan for markdown files
- `-o, --output <path>`: output markdown file path
- `-i, --include <glob>`: include glob pattern, default is `**/*.md`
- `-e, --exclude <patterns...>`: one or more glob exclusion patterns
- `-g, --grouped`: group output sections by inferred complexity

## Sample Output Excerpt

```md
# Markdown Summary Report

- Generated: 2026-03-25T12:00:00.000Z
- Source directory: docs
- Output path: docs/SUMMARY.md
- Files analyzed: 2

## Table of Contents

- 📘 Getting Started — 🟢 beginner
- 💻 API Reference — 🟠 intermediate

## File Summaries

### 📘 Getting Started

- File: getting-started.md
- Path: docs/getting-started.md
- Read time: 2 min
- Complexity: 🟢 beginner
- Audience: beginners, developers

This guide introduces the project setup, highlights the required commands, and explains the first workflow a new user should follow.
```

## Project Structure

- `bin/cli.js`: runtime CLI bootstrap
- `src/index.ts`: command definition and orchestration
- `src/analyzers/content-analyzer.ts`: rule-based markdown analysis
- `src/generators/summary-generator.ts`: markdown report generation
- `src/types/index.ts`: shared domain contracts

## Contributing

1. Install dependencies with `npm install`
2. Build the project with `npm run build`
3. Test the CLI against a markdown directory
4. Keep summaries deterministic and avoid AI-based generation

## License

MIT
