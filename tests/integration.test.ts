import { execFileSync, execSync } from 'child_process';
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';

const projectRoot = path.resolve(__dirname, '..');
const cliEntryPoint = path.join(projectRoot, 'bin', 'cli.js');

describe('Integration Tests', () => {
  beforeAll(() => {
    execSync('npm run build', { cwd: projectRoot, stdio: 'pipe' });
  });

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

    execFileSync(process.execPath, [cliEntryPoint, '--directory', './docs', '--output', 'SUMMARY.md'], {
      cwd: tempDirectory,
      stdio: 'pipe'
    });

    const summary = await fs.readFile(path.join(tempDirectory, 'SUMMARY.md'), 'utf8');

    expect(summary).toContain('# Markdown Summary Report');
    expect(summary).toContain('Introduction');
    expect(summary).toContain('API Reference');
  });

  it('tests error handling for invalid inputs', async () => {
    const tempDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'md-summarizer-invalid-input-'));

    expect(() =>
      execFileSync(process.execPath, [cliEntryPoint, '--directory', '../outside', '--output', 'SUMMARY.md'], {
        cwd: tempDirectory,
        stdio: 'pipe'
      })
    ).toThrow();
  });

  it('tests output generation', async () => {
    const tempDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'md-summarizer-output-'));
    await fs.writeFile(
      path.join(tempDirectory, 'guide.md'),
      '# Getting Started\n\nImportant setup notes for new contributors.\n\n- Install dependencies\n- Run the build',
      'utf8'
    );

    execFileSync(process.execPath, [cliEntryPoint, '--directory', '.', '--output', 'SUMMARY.md', '--grouped'], {
      cwd: tempDirectory,
      stdio: 'pipe'
    });

    const summary = await fs.readFile(path.join(tempDirectory, 'SUMMARY.md'), 'utf8');

    expect(summary).toContain('## Aggregate Statistics');
    expect(summary).toContain('## Table of Contents');
    expect(summary).toContain('## Beginner Documents');
  });
});
