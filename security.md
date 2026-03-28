# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 1.0.x   | Yes       |
| 0.1.x   | No        |

## Reporting a Vulnerability

If you discover a security issue in [`md-summarizer`](README.md), report it privately by emailing `your.email@example.com`.

Include the following in your report:

- A clear description of the issue
- The affected version
- Reproduction steps or a proof of concept
- The expected impact
- Any suggested remediation if available

Initial response time commitment: within 48 hours.

Do not open public GitHub issues for unpatched security vulnerabilities.

## Security Measures

The CLI currently includes these protections:

- Path traversal prevention through [`InputValidator.sanitizePath()`](src/utils/validator.ts:8)
- Pattern sanitization through [`InputValidator.sanitizePattern()`](src/utils/validator.ts:20)
- Safe output filename enforcement through [`InputValidator.sanitizeOutputFilename()`](src/utils/validator.ts:34)
- File-size enforcement through [`InputValidator.validateFileSize()`](src/utils/validator.ts:46)
- File-count enforcement through [`InputValidator.validateFileCount()`](src/utils/validator.ts:68)
- Centralized operational limits in [`SecurityConfig`](src/config/security.ts:1)
- Per-operation throttling through [`RateLimiter.throttle()`](src/utils/rate-limiter.ts:7)
- Structured failure logging through [`Logger.error()`](src/utils/logger.ts:19)
- Domain-specific failures via [`SecurityError`](src/types/index.ts:79), [`ValidationError`](src/types/index.ts:86), and [`FileSystemError`](src/types/index.ts:93)
- Symlink discovery blocking and timeout protection in [`runSummarizer()`](src/index.ts:48), [`discoverMarkdownFiles()`](src/index.ts:101), and [`withTimeout()`](src/index.ts:213)

## Safe Usage

Recommended best practices for users:

- Run the CLI only inside trusted project directories
- Keep output filenames simple, such as [`SUMMARY.md`](README.md)
- Narrow large scans with the [`--exclude`](src/index.ts:39) option
- Review generated summaries before committing them
- Keep dependencies updated and run [`npm audit`](package.json:49) regularly
- Avoid running the tool against untrusted symlink-heavy filesystem trees
