/**
 * Minimal in-memory rate limiter, keyed by IP address.
 *
 * This is enough to blunt naive form-spamming during local development or on
 * a single long-running Node server (e.g. `next start` on a VM or Docker
 * container). It is NOT sufficient for a production deployment on a
 * serverless / multi-instance platform (Vercel, Lambda, etc.), because each
 * instance has its own memory and the counters won't be shared.
 *
 * For production, replace this with a shared store, e.g.:
 *   - Upstash Redis + @upstash/ratelimit (works great on Vercel Edge/Node)
 *   - Vercel Firewall / WAF rate limiting rules
 *   - An API gateway / reverse proxy (Cloudflare, nginx) rate limit rule
 *
 * The call site (app/api/register/route.ts) is isolated so swapping the
 * implementation later only requires changing this file.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 60_000; // 1 minute window
const MAX_REQUESTS = 5; // 5 submissions per IP per minute

export function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(identifier);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  if (bucket.count >= MAX_REQUESTS) {
    return true;
  }

  bucket.count += 1;
  return false;
}

// Periodically clear stale buckets so this Map doesn't grow forever on a
// long-running server.
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets.entries()) {
    if (now > bucket.resetAt) buckets.delete(key);
  }
}, WINDOW_MS).unref?.();
