"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const process_1 = __importDefault(require("process"));
class Logger {
    static log(level, message, data) {
        const timestamp = new Date().toISOString();
        const serializedData = data === undefined ? '' : ` ${serializeLogData(data)}`;
        const entry = `[${timestamp}] [${level.toUpperCase()}] ${message}${serializedData}`;
        if (level === 'error') {
            process_1.default.stderr.write(`${entry}\n`);
            void fs_1.promises.appendFile(Logger.logFile, `${entry}\n`, 'utf8').catch(() => undefined);
        }
    }
    static error(message, error) {
        Logger.log('error', message, error === undefined
            ? undefined
            : {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
    }
}
exports.Logger = Logger;
Logger.logFile = path_1.default.join(process_1.default.cwd(), '.md-sm.log');
function serializeLogData(data) {
    try {
        return JSON.stringify(data);
    }
    catch {
        return String(data);
    }
}
//# sourceMappingURL=logger.js.map