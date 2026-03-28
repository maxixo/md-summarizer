import { promises as fs } from 'fs';
import path from 'path';
import process from 'process';

import chalk from 'chalk';
import { Command } from 'commander';
import { glob } from 'glob';
import ora from 'ora';

import { ContentAnalyzer } from './analyzers/content-analyzer';
import { SecurityConfig } from './config/security';
import { SummaryGenerator } from './generators/summary-generator';
import type { AnalysisResult, SummaryRenderOptions } from './types';
import { FileSystemError, SecurityError } from './types';
import { Logger } from './utils/logger';
import { RateLimiter } from './utils/rate-limiter';
import { InputValidator } from './utils/validator';

interface CliOptions {
  readonly directory: string;
  readonly output: string;
  readonly include: string;
  readonly exclude: readonly string[];
  readonly grouped: boolean;
}

async function main(): Promise<void> {
  const program = new Command();

  program
    .name('md-summarizer')
    .description('Summarize markdown files using deterministic rule-based analysis.')
    .option('-d, --directory <path>', 'Directory to scan for markdown files', '.')
    .option('-o, --output <filename>', 'Output markdown summary filename', 'SUMMARY.md')
    .option('-i, --include <glob>', 'Glob for markdown inclusion', '**/*.md')
    .option('-e, --exclude <patterns...>', 'Glob patterns to exclude', ['node_modules/**', 'dist/**', 'SUMMARY.md'])
    .option('-g, --grouped', 'Group results by complexity instead of sequential order', false)
    .action(async (rawOptions: CliOptions) => {
      await runSummarizer(rawOptions);
    });

  await program.parseAsync(process.argv);
}

async function runSummarizer(options: CliOptions): Promise<void> {
  const analyzer = new ContentAnalyzer();
  const generator = new SummaryGenerator();
  const rateLimiter = new RateLimiter(SecurityConfig.MAX_OPS_PER_SECOND);
  const spinner = ora('Resolving options').start();

  try {
    const safeDirectory = InputValidator.sanitizePath(options.directory);
    const safeOutput = InputValidator.sanitizeOutputFilename(options.output);
    const safePattern = normalizePattern(InputValidator.sanitizePattern(options.include));
    const safeExcludePatterns = options.exclude.map((pattern) => normalizePattern(InputValidator.sanitizePattern(pattern)));
    const outputPath = path.resolve(process.cwd(), safeOutput);

    spinner.text = 'Discovering markdown files';
    const markdownFiles = await withTimeout(
      discoverMarkdownFiles(safeDirectory, safePattern, safeExcludePatterns, outputPath),
      SecurityConfig.OPERATION_TIMEOUT,
      'File discovery'
    );
    InputValidator.validateFileCount(markdownFiles.length, SecurityConfig.MAX_FILES);

    if (markdownFiles.length === 0) {
      spinner.warn(chalk.yellow(`No markdown files matched in ${normalizePath(safeDirectory)}.`));
      return;
    }

    spinner.text = 'Analyzing markdown content';
    const analyses = await withTimeout(
      analyzeFiles(markdownFiles, analyzer, rateLimiter),
      SecurityConfig.OPERATION_TIMEOUT,
      'Markdown analysis'
    );

    spinner.text = 'Generating summary document';
    const document = generator.generateDocument(
      analyses,
      buildRenderOptions(safeDirectory, outputPath, options.grouped)
    );

    spinner.text = 'Writing output file';
    await withTimeout(writeOutputFile(outputPath, document), SecurityConfig.OPERATION_TIMEOUT, 'Summary file write');

    spinner.succeed(chalk.green(`Summary written to ${normalizePath(outputPath)}`));
    process.stdout.write(`${chalk.cyan('Files analyzed:')} ${analyses.length}\n`);
    process.stdout.write(`${chalk.cyan('Output:')} ${normalizePath(outputPath)}\n`);
  } catch (error: unknown) {
    const normalizedError = toError(error);
    Logger.error('md-summarizer execution failed.', normalizedError);
    spinner.fail(formatError(normalizedError));
    process.exitCode = 1;
  }
}

async function discoverMarkdownFiles(
  directory: string,
  includePattern: string,
  excludePatterns: readonly string[],
  outputPath: string
): Promise<readonly string[]> {
  const matches = await glob(includePattern, {
    cwd: directory,
    nodir: true,
    follow: false,
    ignore: [...excludePatterns, normalizePath(path.relative(directory, outputPath))]
  });

  return [...new Set(matches)]
    .filter((match) => isWithinMaxDepth(match, SecurityConfig.MAX_DEPTH))
    .map((match) => resolveDiscoveredFile(directory, match))
    .filter((filePath) => isAllowedExtension(filePath))
    .sort((left, right) => normalizePath(left).localeCompare(normalizePath(right)));
}

async function analyzeFiles(
  markdownFiles: readonly string[],
  analyzer: ContentAnalyzer,
  rateLimiter: RateLimiter
): Promise<readonly AnalysisResult[]> {
  const analyses: AnalysisResult[] = [];

  for (const filePath of markdownFiles) {
    await rateLimiter.throttle();
    await validateInputFile(filePath);
    await InputValidator.validateFileSize(filePath, SecurityConfig.MAX_FILE_SIZE);

    const content = await fs.readFile(filePath, 'utf8');

    analyses.push(
      analyzer.analyze({
        filePath: path.relative(process.cwd(), filePath) || path.basename(filePath),
        content
      })
    );
  }

  return analyses;
}

function buildRenderOptions(directory: string, outputPath: string, grouped: boolean): SummaryRenderOptions {
  return {
    generatedAt: new Date().toISOString(),
    sourceDirectory: normalizePath(directory),
    outputPath: normalizePath(outputPath),
    grouped
  };
}

function normalizePattern(pattern: string): string {
  return pattern.trim().replace(/\\/g, '/');
}

function normalizePath(filePath: string): string {
  return filePath.replace(/\\/g, '/');
}

function formatError(error: unknown): string {
  if (error instanceof SecurityError || error instanceof FileSystemError || error instanceof Error) {
    return chalk.red(error.message);
  }

  return chalk.red('An unknown error occurred during summarization.');
}

function resolveDiscoveredFile(directory: string, match: string): string {
  const resolvedPath = path.resolve(directory, match);
  const relativePath = path.relative(directory, resolvedPath);

  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    throw new SecurityError(`Discovered file escapes the target directory: ${match}`);
  }

  return resolvedPath;
}

function isWithinMaxDepth(relativePath: string, maxDepth: number): boolean {
  const normalizedRelativePath = normalizePath(relativePath);
  const segments = normalizedRelativePath.split('/').filter(Boolean);

  return segments.length <= maxDepth;
}

function isAllowedExtension(filePath: string): boolean {
  const allowedExtensions = SecurityConfig.ALLOWED_EXTENSIONS as readonly string[];
  return allowedExtensions.includes(path.extname(filePath).toLowerCase());
}

async function validateInputFile(filePath: string): Promise<void> {
  try {
    const fileStats = await fs.lstat(filePath);

    if (fileStats.isSymbolicLink()) {
      throw new SecurityError(`Symlinked files are not allowed: ${normalizePath(filePath)}`);
    }

    if (!fileStats.isFile()) {
      throw new FileSystemError(`Path is not a regular file: ${normalizePath(filePath)}`);
    }
  } catch (error: unknown) {
    const fileError = error as NodeJS.ErrnoException;

    if (fileError.code === 'ENOENT') {
      throw new FileSystemError(`File not found: ${normalizePath(filePath)}`);
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new FileSystemError(`Unable to validate file access: ${normalizePath(filePath)}`);
  }
}

async function writeOutputFile(outputPath: string, document: string): Promise<void> {
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, document, 'utf8');
}

async function withTimeout<T>(operation: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  let timeoutHandle: NodeJS.Timeout | undefined;

  try {
    return await Promise.race([
      operation,
      new Promise<T>((_, reject) => {
        timeoutHandle = setTimeout(() => {
          reject(new SecurityError(`${label} exceeded the timeout of ${timeoutMs}ms.`));
        }, timeoutMs);
      })
    ]);
  } finally {
    if (timeoutHandle !== undefined) {
      clearTimeout(timeoutHandle);
    }
  }
}

function toError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  return new Error(typeof error === 'string' ? error : 'An unknown error occurred during summarization.');
}

void main();
