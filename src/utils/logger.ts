import { promises as fs } from 'fs';
import path from 'path';
import process from 'process';

export class Logger {
  static logFile: string = path.join(process.cwd(), '.md-summarizer.log');

  static log(level: 'info' | 'warn' | 'error', message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const serializedData = data === undefined ? '' : ` ${serializeLogData(data)}`;
    const entry = `[${timestamp}] [${level.toUpperCase()}] ${message}${serializedData}`;

    if (level === 'error') {
      process.stderr.write(`${entry}\n`);
      void fs.appendFile(Logger.logFile, `${entry}\n`, 'utf8').catch(() => undefined);
    }
  }

  static error(message: string, error?: Error): void {
    Logger.log(
      'error',
      message,
      error === undefined
        ? undefined
        : {
            name: error.name,
            message: error.message,
            stack: error.stack
          }
    );
  }
}

function serializeLogData(data: unknown): string {
  try {
    return JSON.stringify(data);
  } catch {
    return String(data);
  }
}
