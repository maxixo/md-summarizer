import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';

import { runSummarizer } from '../src/index';

const defaultOptions = {
  include: '**/*.md',
  exclude: ['node_modules/**', 'dist/**', 'SUMMARY.md'],
  grouped: false
} as const;

async function runInDirectory(
  cwd: string,
  options: {
    readonly directory: string;
    readonly output: string;
    readonly grouped?: boolean;
  }
): Promise<boolean> {
  const originalWorkingDirectory = process.cwd();
  process.chdir(cwd);

  try {
    return await runSummarizer({
      ...defaultOptions,
      ...options,
      grouped: options.grouped ?? false
    });
  } finally {
    process.chdir(originalWorkingDirectory);
    process.exitCode = 0;
  }
}

describe('Integration Tests', () => {
  it('tests full CLI workflow with sample files', async () => {
    const tempDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'md-summarizer-integration-'));
    await fs.mkdir(path.join(tempDirectory, 'docs'), { recursive: true });
    await fs.writeFile(
      path.join(tempDirectory, 'docs', 'intro.md'),
      '# Introduction\n\nThis guide explains the setup process and useful commands.',
      'utf8'
    );
    await fs.writeFile(
      path.join(tempDirectory, 'docs', 'api.md'),
      '# API Reference\n\nUse the CLI to generate a deterministic markdown summary.',
      'utf8'
    );

    const isSuccessful = await runInDirectory(tempDirectory, { directory: './docs', output: 'SUMMARY.md' });

    expect(isSuccessful).toBe(true);
    const summary = await fs.readFile(path.join(tempDirectory, 'SUMMARY.md'), 'utf8');

    expect(summary).toContain('# Markdown Summary Report');
    expect(summary).toContain('Introduction');
    expect(summary).toContain('API Reference');
  });

  it('tests error handling for invalid inputs', async () => {
    const tempDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'md-summarizer-invalid-input-'));

    const isSuccessful = await runInDirectory(tempDirectory, { directory: '../outside', output: 'SUMMARY.md' });

    expect(isSuccessful).toBe(false);
  });

  it('tests output generation', async () => {
    const tempDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'md-summarizer-output-'));
    await fs.writeFile(
      path.join(tempDirectory, 'guide.md'),
      '# Getting Started\n\nImportant setup notes for new contributors.\n\n- Install dependencies\n- Run the build',
      'utf8'
    );

    const isSuccessful = await runInDirectory(tempDirectory, { directory: '.', output: 'SUMMARY.md', grouped: true });

    expect(isSuccessful).toBe(true);
    const summary = await fs.readFile(path.join(tempDirectory, 'SUMMARY.md'), 'utf8');

    expect(summary).toContain('## Aggregate Statistics');
    expect(summary).toContain('## Table of Contents');
    expect(summary).toContain('## Beginner Documents');
  });
});
