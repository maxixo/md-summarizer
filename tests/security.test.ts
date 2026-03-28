import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';

import { InputValidator } from '../src/utils/validator';

describe('Security Tests', () => {
  describe('Path Traversal Prevention', () => {
    it('should block path traversal attempts', () => {
      const originalCwd = process.cwd();
      const safeRoot = fs.mkdtemp(path.join(os.tmpdir(), 'md-summarizer-safe-root-'));

      return safeRoot
        .then(async (workspaceRoot) => {
          process.chdir(workspaceRoot);

          expect(() => InputValidator.sanitizePath('../../../etc/passwd')).toThrow('Path traversal detected');
          expect(() => InputValidator.sanitizePath('..\\..\\..\\Windows\\system32')).toThrow(
            'Path traversal detected'
          );
        })
        .finally(() => {
          process.chdir(originalCwd);
        });
    });

    it('should allow safe relative paths', async () => {
      const originalCwd = process.cwd();
      const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'md-summarizer-safe-root-'));

      try {
        const docsDirectory = path.join(workspaceRoot, 'docs');
        await fs.mkdir(docsDirectory, { recursive: true });
        process.chdir(workspaceRoot);

        expect(InputValidator.sanitizePath('./docs')).toBe(path.resolve(workspaceRoot, './docs'));
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe('Pattern Injection Prevention', () => {
    it('should block command injection', () => {
      expect(() => InputValidator.sanitizePattern('*.md; rm -rf /')).toThrow('dangerous characters');
    });

    it('should allow safe glob patterns', () => {
      expect(InputValidator.sanitizePattern('**/*.md')).toBe('**/*.md');
    });
  });

  describe('Filename Validation', () => {
    it('should block invalid filenames', () => {
      expect(() => InputValidator.sanitizeOutputFilename('../malicious.md')).toThrow(
        'Output filename must match'
      );
    });

    it('should allow safe filenames', () => {
      expect(InputValidator.sanitizeOutputFilename('SUMMARY.md')).toBe('SUMMARY.md');
    });
  });

  describe('File Size Limits', () => {
    it('should reject files over size limit', async () => {
      const tempDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'md-summarizer-file-size-'));
      const oversizedFile = path.join(tempDirectory, 'oversized.md');
      await fs.writeFile(oversizedFile, 'x'.repeat(32), 'utf8');

      await expect(InputValidator.validateFileSize(oversizedFile, 8)).rejects.toThrow(
        'maximum allowed size'
      );
    });

    it('should accept files under limit', async () => {
      const tempDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'md-summarizer-file-size-'));
      const validFile = path.join(tempDirectory, 'valid.md');
      await fs.writeFile(validFile, '# Small file', 'utf8');

      await expect(InputValidator.validateFileSize(validFile, 1024)).resolves.toBeUndefined();
    });
  });

  describe('File Count Limits', () => {
    it('should reject excessive file counts', () => {
      expect(() => InputValidator.validateFileCount(1001, 1000)).toThrow('Use the --exclude flag');
    });

    it('should accept normal file counts', () => {
      expect(() => InputValidator.validateFileCount(12, 1000)).not.toThrow();
    });
  });
});
