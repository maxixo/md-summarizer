export declare class RateLimiter {
    private readonly maxOperationsPerSecond;
    private operations;
    private startTime;
    constructor(maxOperationsPerSecond?: number);
    throttle(): Promise<void>;
    reset(): void;
}
