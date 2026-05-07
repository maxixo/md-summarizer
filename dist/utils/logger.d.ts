export declare class Logger {
    static logFile: string;
    static log(level: 'info' | 'warn' | 'error', message: string, data?: unknown): void;
    static error(message: string, error?: Error): void;
}
