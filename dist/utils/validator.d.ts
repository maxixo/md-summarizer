export declare class InputValidator {
    static sanitizePath(inputPath: string): string;
    static sanitizePattern(pattern: string): string;
    static sanitizeOutputFilename(filename: string): string;
    static validateFileSize(filePath: string, maxSize?: number): Promise<void>;
    static validateFileCount(count: number, maxFiles?: number): void;
}
