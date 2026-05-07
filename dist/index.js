"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
exports.runSummarizer = runSummarizer;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const process_1 = __importDefault(require("process"));
const chalk_1 = __importDefault(require("chalk"));
const commander_1 = require("commander");
const glob_1 = require("glob");
const ora_1 = __importDefault(require("ora"));
const content_analyzer_1 = require("./analyzers/content-analyzer");
const security_1 = require("./config/security");
const summary_generator_1 = require("./generators/summary-generator");
const types_1 = require("./types");
const logger_1 = require("./utils/logger");
const rate_limiter_1 = require("./utils/rate-limiter");
const validator_1 = require("./utils/validator");
async function main(argv = process_1.default.argv) {
    const program = new commander_1.Command();
    program
        .name('md-sm')
        .description('Summarize markdown files using deterministic rule-based analysis.')
        .option('-d, --directory <path>', 'Directory to scan for markdown files', '.')
        .option('-o, --output <filename>', 'Output markdown summary filename', 'SUMMARY.md')
        .option('-i, --include <glob>', 'Glob for markdown inclusion', '**/*.md')
        .option('-e, --exclude <patterns...>', 'Glob patterns to exclude', ['node_modules/**', 'dist/**', 'SUMMARY.md'])
        .option('-g, --grouped', 'Group results by complexity instead of sequential order', false)
        .action(async (rawOptions) => {
        await runSummarizer(rawOptions);
    });
    await program.parseAsync(argv);
}
async function runSummarizer(options) {
    const analyzer = new content_analyzer_1.ContentAnalyzer();
    const generator = new summary_generator_1.SummaryGenerator();
    const rateLimiter = new rate_limiter_1.RateLimiter(security_1.SecurityConfig.MAX_OPS_PER_SECOND);
    const spinner = (0, ora_1.default)('Resolving options').start();
    try {
        const safeDirectory = validator_1.InputValidator.sanitizePath(options.directory);
        const safeOutput = validator_1.InputValidator.sanitizeOutputFilename(options.output);
        const safePattern = normalizePattern(validator_1.InputValidator.sanitizePattern(options.include));
        const safeExcludePatterns = options.exclude.map((pattern) => normalizePattern(validator_1.InputValidator.sanitizePattern(pattern)));
        const outputPath = path_1.default.resolve(process_1.default.cwd(), safeOutput);
        spinner.text = 'Discovering markdown files';
        const markdownFiles = await withTimeout(discoverMarkdownFiles(safeDirectory, safePattern, safeExcludePatterns, outputPath), security_1.SecurityConfig.OPERATION_TIMEOUT, 'File discovery');
        validator_1.InputValidator.validateFileCount(markdownFiles.length, security_1.SecurityConfig.MAX_FILES);
        if (markdownFiles.length === 0) {
            spinner.warn(chalk_1.default.yellow(`No markdown files matched in ${normalizePath(safeDirectory)}.`));
            return true;
        }
        spinner.text = 'Analyzing markdown content';
        const analyses = await withTimeout(analyzeFiles(markdownFiles, analyzer, rateLimiter), security_1.SecurityConfig.OPERATION_TIMEOUT, 'Markdown analysis');
        spinner.text = 'Generating summary document';
        const document = generator.generateDocument(analyses, buildRenderOptions(safeDirectory, outputPath, options.grouped));
        spinner.text = 'Writing output file';
        await withTimeout(writeOutputFile(outputPath, document), security_1.SecurityConfig.OPERATION_TIMEOUT, 'Summary file write');
        spinner.succeed(chalk_1.default.green(`Summary written to ${normalizePath(outputPath)}`));
        process_1.default.stdout.write(`${chalk_1.default.cyan('Files analyzed:')} ${analyses.length}\n`);
        process_1.default.stdout.write(`${chalk_1.default.cyan('Output:')} ${normalizePath(outputPath)}\n`);
        return true;
    }
    catch (error) {
        const normalizedError = toError(error);
        logger_1.Logger.error('md-sm execution failed.', normalizedError);
        spinner.fail(formatError(normalizedError));
        process_1.default.exitCode = 1;
        return false;
    }
}
async function discoverMarkdownFiles(directory, includePattern, excludePatterns, outputPath) {
    const matches = await (0, glob_1.glob)(includePattern, {
        cwd: directory,
        nodir: true,
        follow: false,
        ignore: [...excludePatterns, normalizePath(path_1.default.relative(directory, outputPath))]
    });
    return [...new Set(matches)]
        .filter((match) => isWithinMaxDepth(match, security_1.SecurityConfig.MAX_DEPTH))
        .map((match) => resolveDiscoveredFile(directory, match))
        .filter((filePath) => isAllowedExtension(filePath))
        .sort((left, right) => normalizePath(left).localeCompare(normalizePath(right)));
}
async function analyzeFiles(markdownFiles, analyzer, rateLimiter) {
    const analyses = [];
    for (const filePath of markdownFiles) {
        await rateLimiter.throttle();
        await validateInputFile(filePath);
        await validator_1.InputValidator.validateFileSize(filePath, security_1.SecurityConfig.MAX_FILE_SIZE);
        const content = await fs_1.promises.readFile(filePath, 'utf8');
        analyses.push(analyzer.analyze({
            filePath: path_1.default.relative(process_1.default.cwd(), filePath) || path_1.default.basename(filePath),
            content
        }));
    }
    return analyses;
}
function buildRenderOptions(directory, outputPath, grouped) {
    return {
        generatedAt: new Date().toISOString(),
        sourceDirectory: normalizePath(directory),
        outputPath: normalizePath(outputPath),
        grouped
    };
}
function normalizePattern(pattern) {
    return pattern.trim().replace(/\\/g, '/');
}
function normalizePath(filePath) {
    return filePath.replace(/\\/g, '/');
}
function formatError(error) {
    if (error instanceof types_1.SecurityError || error instanceof types_1.FileSystemError || error instanceof Error) {
        return chalk_1.default.red(error.message);
    }
    return chalk_1.default.red('An unknown error occurred during summarization.');
}
function resolveDiscoveredFile(directory, match) {
    const resolvedPath = path_1.default.resolve(directory, match);
    const relativePath = path_1.default.relative(directory, resolvedPath);
    if (relativePath.startsWith('..') || path_1.default.isAbsolute(relativePath)) {
        throw new types_1.SecurityError(`Discovered file escapes the target directory: ${match}`);
    }
    return resolvedPath;
}
function isWithinMaxDepth(relativePath, maxDepth) {
    const normalizedRelativePath = normalizePath(relativePath);
    const segments = normalizedRelativePath.split('/').filter(Boolean);
    return segments.length <= maxDepth;
}
function isAllowedExtension(filePath) {
    const allowedExtensions = security_1.SecurityConfig.ALLOWED_EXTENSIONS;
    return allowedExtensions.includes(path_1.default.extname(filePath).toLowerCase());
}
async function validateInputFile(filePath) {
    try {
        const fileStats = await fs_1.promises.lstat(filePath);
        if (fileStats.isSymbolicLink()) {
            throw new types_1.SecurityError(`Symlinked files are not allowed: ${normalizePath(filePath)}`);
        }
        if (!fileStats.isFile()) {
            throw new types_1.FileSystemError(`Path is not a regular file: ${normalizePath(filePath)}`);
        }
    }
    catch (error) {
        const fileError = error;
        if (fileError.code === 'ENOENT') {
            throw new types_1.FileSystemError(`File not found: ${normalizePath(filePath)}`);
        }
        if (error instanceof Error) {
            throw error;
        }
        throw new types_1.FileSystemError(`Unable to validate file access: ${normalizePath(filePath)}`);
    }
}
async function writeOutputFile(outputPath, document) {
    await fs_1.promises.mkdir(path_1.default.dirname(outputPath), { recursive: true });
    await fs_1.promises.writeFile(outputPath, document, 'utf8');
}
async function withTimeout(operation, timeoutMs, label) {
    let timeoutHandle;
    try {
        return await Promise.race([
            operation,
            new Promise((_, reject) => {
                timeoutHandle = setTimeout(() => {
                    reject(new types_1.SecurityError(`${label} exceeded the timeout of ${timeoutMs}ms.`));
                }, timeoutMs);
            })
        ]);
    }
    finally {
        if (timeoutHandle !== undefined) {
            clearTimeout(timeoutHandle);
        }
    }
}
function toError(error) {
    if (error instanceof Error) {
        return error;
    }
    return new Error(typeof error === 'string' ? error : 'An unknown error occurred during summarization.');
}
if (require.main === module) {
    void main();
}
//# sourceMappingURL=index.js.map