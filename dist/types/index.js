"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemError = exports.ValidationError = exports.SecurityError = void 0;
class SecurityError extends Error {
    constructor(message) {
        super(message);
        this.name = 'SecurityError';
    }
}
exports.SecurityError = SecurityError;
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
class FileSystemError extends Error {
    constructor(message) {
        super(message);
        this.name = 'FileSystemError';
    }
}
exports.FileSystemError = FileSystemError;
//# sourceMappingURL=index.js.map