# Contributing

## How to Contribute

- Fork the repository
- Create a feature branch
- Make your changes with tests where appropriate
- Open a pull request with a clear description

## Development Setup

```bash
npm install
npm run build
```

Run the CLI locally:

```bash
npm start -- --directory . --output SUMMARY.md
```

## Running Tests

```bash
npm test
npm run test:coverage
```

## Code Style Guidelines

- Use TypeScript for source changes under [`src/`](src/index.ts)
- Follow the lint rules in [`.eslintrc.js`](.eslintrc.js)
- Format consistently with [`.prettierrc`](.prettierrc)
- Preserve deterministic output behavior in [`SummaryGenerator.generateDocument()`](src/generators/summary-generator.ts:13)

## Pull Request Process

1. Ensure tests and build pass locally
2. Update documentation when behavior changes
3. Keep pull requests focused and reviewable
4. Include security considerations for filesystem or CLI input changes

## Code of Conduct

Contributors are expected to act professionally and respectfully in all project discussions and reviews.
