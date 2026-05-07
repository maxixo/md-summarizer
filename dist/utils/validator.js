"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputValidator = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const process_1 = __importDefault(require("process"));
const types_1 = require("../types");
class InputValidator {
    static sanitizePath(inputPath) {
        const resolvedPath = path_1.default.resolve(inputPath);
        const currentWorkingDirectory = path_1.default.resolve(process_1.default.cwd());
        const relativePath = path_1.default.relative(currentWorkingDirectory, resolvedPath);
        if (relativePath !== '' &&
            (relativePath.startsWith('..') || path_1.default.isAbsolute(relativePath))) {
            throw new types_1.SecurityError(`Path traversal detected: ${inputPath}`);
        }
        return resolvedPath;
    }
    static sanitizePattern(pattern) {
        const trimmedPattern = pattern.trim();
        const dangerousCharacters = [';', '&', '|', '`', '$', '(', ')', '{', '}', '[', ']', '<', '>'];
        if (trimmedPattern.length === 0) {
            throw new types_1.ValidationError('Glob pattern cannot be empty.');
        }
        if (dangerousCharacters.some((character) => trimmedPattern.includes(character))) {
            throw new types_1.ValidationError(`Pattern contains dangerous characters: ${pattern}`);
        }
        return trimmedPattern;
    }
    static sanitizeOutputFilename(filename) {
        const trimmedFilename = filename.trim();
        if (!/^[a-zA-Z0-9._-]+\.md$/.test(trimmedFilename)) {
            throw new types_1.ValidationError('Output filename must match /^[a-zA-Z0-9._-]+\\.md$/ and cannot include directory segments.');
        }
        return trimmedFilename;
    }
    static async validateFileSize(filePath, maxSize = 10485760) {
        try {
            const stats = await fs_1.promises.stat(filePath);
            if (stats.size > maxSize) {
                throw new types_1.SecurityError(`File exceeds the maximum allowed size of ${maxSize} bytes: ${filePath}`);
            }
        }
        catch (error) {
            const fileError = error;
            if (fileError.code === 'ENOENT') {
                throw new types_1.FileSystemError(`File not found during validation: ${filePath}`);
            }
            if (error instanceof Error) {
                throw error;
            }
            throw new types_1.FileSystemError(`Unable to validate file size for: ${filePath}`);
        }
    }
    static validateFileCount(count, maxFiles = 1000) {
        if (count > maxFiles) {
            throw new types_1.SecurityError(`Discovered ${count} files, which exceeds the maximum of ${maxFiles}. Use the --exclude flag to narrow the scan.`);
        }
    }
}
exports.InputValidator = InputValidator;
//# sourceMappingURL=validator.js.map