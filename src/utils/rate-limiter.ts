export class RateLimiter {
  private operations = 0;
  private startTime = Date.now();

  constructor(private readonly maxOperationsPerSecond: number = 100) {}

  async throttle(): Promise<void> {
    const elapsedTime = Date.now() - this.startTime;

    if (elapsedTime >= 1000) {
      this.reset();
    }

    this.operations += 1;

    const windowElapsed = Math.max(Date.now() - this.startTime, 1);
    const currentRate = this.operations / (windowElapsed / 1000);

    if (currentRate <= this.maxOperationsPerSecond) {
      return;
    }

    const expectedElapsed = (this.operations / this.maxOperationsPerSecond) * 1000;
    const delay = Math.ceil(expectedElapsed - windowElapsed);

    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    if (Date.now() - this.startTime >= 1000) {
      this.reset();
    }
  }

  reset(): void {
    this.operations = 0;
    this.startTime = Date.now();
  }
}
