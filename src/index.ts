import { promises as fs } from 'fs';
import path from 'path';
import process from 'process';
import { promisify } from 'util';

import chalk from 'chalk';
import { Command } from 'commander';
import glob from 'glob';
import ora from 'ora';

import { ContentAnalyzer } from './analyzers/content-analyzer';
import { SummaryGenerator } from './generators/summary-generator';
import type { AnalysisResult, SummaryRenderOptions } from './types';

const globAsync = promisify(glob);

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
    .option('-o, --output <path>', 'Output markdown summary file', 'SUMMARY.md')
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
  const spinner = ora('Resolving options').start();

  try {
    const directory = path.resolve(options.directory);
    const outputPath = path.resolve(options.output);
    const includePattern = normalizePattern(options.include);
    const excludePatterns = options.exclude.map(normalizePattern);

    spinner.text = 'Discovering markdown files';
    const markdownFiles = await discoverMarkdownFiles(directory, includePattern, excludePatterns, outputPath);

    if (markdownFiles.length === 0) {
      spinner.warn(chalk.yellow(`No markdown files matched in ${normalizePath(directory)}.`));
      return;
    }

    spinner.text = 'Analyzing markdown content';
    const analyses = await analyzeFiles(markdownFiles, analyzer);

    spinner.text = 'Generating summary document';
    const document = generator.generateDocument(analyses, buildRenderOptions(directory, outputPath, options.grouped));

    spinner.text = 'Writing output file';
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, document, 'utf8');

    spinner.succeed(chalk.green(`Summary written to ${normalizePath(outputPath)}`));
    process.stdout.write(`${chalk.cyan('Files analyzed:')} ${analyses.length}\n`);
    process.stdout.write(`${chalk.cyan('Output:')} ${normalizePath(outputPath)}\n`);
  } catch (error: unknown) {
    spinner.fail(formatError(error));
    process.exitCode = 1;
  }
}

async function discoverMarkdownFiles(
  directory: string,
  includePattern: string,
  excludePatterns: readonly string[],
  outputPath: string
): Promise<readonly string[]> {
  const matches = await globAsync(includePattern, {
    cwd: directory,
    nodir: true,
    ignore: [...excludePatterns, normalizePath(path.relative(directory, outputPath))]
  });

  return [...new Set(matches)]
    .map((match) => path.resolve(directory, match))
    .filter((filePath) => filePath.toLowerCase().endsWith('.md'))
    .sort((left, right) => normalizePath(left).localeCompare(normalizePath(right)));
}

async function analyzeFiles(
  markdownFiles: readonly string[],
  analyzer: ContentAnalyzer
): Promise<readonly AnalysisResult[]> {
  const settled = await Promise.all(
    markdownFiles.map(async (filePath) => {
      const content = await fs.readFile(filePath, 'utf8');
      return analyzer.analyze({
        filePath: path.relative(process.cwd(), filePath) || path.basename(filePath),
        content
      });
    })
  );

  return settled;
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
  return pattern.replace(/\\/g, '/');
}

function normalizePath(filePath: string): string {
  return filePath.replace(/\\/g, '/');
}

function formatError(error: unknown): string {
  if (error instanceof Error) {
    return chalk.red(error.message);
  }

  return chalk.red('An unknown error occurred during summarization.');
}

void main();
