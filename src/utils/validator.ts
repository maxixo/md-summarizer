import { promises as fs } from 'fs';
import path from 'path';
import process from 'process';

import { FileSystemError, SecurityError, ValidationError } from '../types';

export class InputValidator {
  static sanitizePath(inputPath: string): string {
    const resolvedPath = path.resolve(inputPath);
    const currentWorkingDirectory = path.resolve(process.cwd());
    const relativePath = path.relative(currentWorkingDirectory, resolvedPath);

    if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
      throw new SecurityError(`Path traversal detected: ${inputPath}`);
    }

    return resolvedPath;
  }

  static sanitizePattern(pattern: string): string {
    const trimmedPattern = pattern.trim();

    if (trimmedPattern.length === 0) {
      throw new ValidationError('Glob pattern cannot be empty.');
    }

    if (/[;&|`$(){}\[\]<>]/.test(trimmedPattern)) {
      throw new ValidationError(`Pattern contains dangerous characters: ${pattern}`);
    }

    return trimmedPattern;
  }

  static sanitizeOutputFilename(filename: string): string {
    const trimmedFilename = filename.trim();

    if (!/^[a-zA-Z0-9._-]+\.md$/.test(trimmedFilename)) {
      throw new ValidationError(
        'Output filename must match /^[a-zA-Z0-9._-]+\\.md$/ and cannot include directory segments.'
      );
    }

    return trimmedFilename;
  }

  static async validateFileSize(filePath: string, maxSize: number = 10485760): Promise<void> {
    try {
      const stats = await fs.stat(filePath);

      if (stats.size > maxSize) {
        throw new SecurityError(`File exceeds the maximum allowed size of ${maxSize} bytes: ${filePath}`);
      }
    } catch (error: unknown) {
      const fileError = error as NodeJS.ErrnoException;

      if (fileError.code === 'ENOENT') {
        throw new FileSystemError(`File not found during validation: ${filePath}`);
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new FileSystemError(`Unable to validate file size for: ${filePath}`);
    }
  }

  static validateFileCount(count: number, maxFiles: number = 1000): void {
    if (count > maxFiles) {
      throw new SecurityError(
        `Discovered ${count} files, which exceeds the maximum of ${maxFiles}. Use the --exclude flag to narrow the scan.`
      );
    }
  }
}
