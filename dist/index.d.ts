export interface CliOptions {
    readonly directory: string;
    readonly output: string;
    readonly include: string;
    readonly exclude: readonly string[];
    readonly grouped: boolean;
}
export declare function main(argv?: readonly string[]): Promise<void>;
export declare function runSummarizer(options: CliOptions): Promise<boolean>;
