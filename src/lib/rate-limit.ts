/**
 * In-memory sliding-window rate limiter for authentication routes.
 *
 * Implements IP and compound key rate-limiting with configurable
 * windows, thresholds, and automatic eviction of expired windows.
 */

interface RateLimitRecord {
  timestamps: number[];
}

export interface RateLimitConfig {
  maxRequests: number; // Maximum allowed requests in window
  windowSeconds: number; // Time window in seconds
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
  retryAfterSeconds: number;
}

class InMemoryRateLimiter {
  private store = new Map<string, RateLimitRecord>();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Periodically prune stale entries every 5 minutes to prevent memory leak
    if (typeof setInterval !== "undefined") {
      this.cleanupInterval = setInterval(() => this.prune(), 5 * 60 * 1000);
      if (this.cleanupInterval.unref) {
        this.cleanupInterval.unref();
      }
    }
  }

  public check(key: string, config: RateLimitConfig): RateLimitResult {
    const now = Date.now();
    const windowMs = config.windowSeconds * 1000;
    const windowStart = now - windowMs;

    let record = this.store.get(key);
    if (!record) {
      record = { timestamps: [] };
      this.store.set(key, record);
    }

    // Keep only timestamps within the current sliding window
    record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

    const count = record.timestamps.length;
    if (count >= config.maxRequests) {
      const oldestInWindow = record.timestamps[0];
      const retryAfterMs = oldestInWindow + windowMs - now;
      const retryAfterSeconds = Math.max(1, Math.ceil(retryAfterMs / 1000));
      return {
        allowed: false,
        limit: config.maxRequests,
        remaining: 0,
        resetSeconds: retryAfterSeconds,
        retryAfterSeconds,
      };
    }

    // Register this request
    record.timestamps.push(now);
    const remaining = config.maxRequests - record.timestamps.length;

    return {
      allowed: true,
      limit: config.maxRequests,
      remaining,
      resetSeconds: config.windowSeconds,
      retryAfterSeconds: 0,
    };
  }

  public reset(key: string): void {
    this.store.delete(key);
  }

  public clear(): void {
    this.store.clear();
  }

  private prune(): void {
    const now = Date.now();
    const maxWindowMs = 60 * 60 * 1000; // 1 hour max retention
    for (const [key, record] of this.store.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < maxWindowMs);
      if (record.timestamps.length === 0) {
        this.store.delete(key);
      }
    }
  }
}

export const rateLimiter = new InMemoryRateLimiter();

/**
 * Standard rate limit configurations for Swash auth operations:
 * - Registration: 5 requests per 15 minutes per IP
 * - Login: 5 attempts per 15 minutes per IP
 * - Password Reset Request: 3 requests per 15 minutes per IP
 */
export const AUTH_RATE_LIMITS = {
  register: { maxRequests: 5, windowSeconds: 15 * 60 },
  login: { maxRequests: 5, windowSeconds: 15 * 60 },
  passwordReset: { maxRequests: 3, windowSeconds: 15 * 60 },
} as const;

/**
 * Extract client IP from headers.
 * In production behind trusted proxies (Vercel, Cloudflare, AWS), x-forwarded-for
 * contains the client IP at index 0 or rightmost depending on configuration.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const ips = forwarded.split(",").map((s) => s.trim());
    if (ips[0]) return ips[0];
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "127.0.0.1";
}

