/**
 * 通用限流工厂函数
 * 供多个 API Route 共用，避免重复实现
 * 基于内存的 IP + 全局每日双重限流
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitOptions {
  /** 每 IP 在窗口内最大请求数 */
  perIp: number;
  /** 全局每日最大请求数 */
  perDay: number;
  /** 窗口时长（毫秒） */
  windowMs: number;
}

export function createRateLimiter(options: RateLimitOptions) {
  const { perIp, perDay, windowMs } = options;
  const ipMap = new Map<string, RateLimitEntry>();
  let dailyCount   = 0;
  let dailyResetAt = Date.now() + 86_400_000;

  /** 定时清理过期记录，避免内存泄漏 */
  setInterval(() => {
    const now = Date.now();
    ipMap.forEach((entry, ip) => {
      if (now > entry.resetAt) ipMap.delete(ip);
    });
  }, windowMs);

  return function isRateLimited(ip: string): boolean {
    const now = Date.now();
    if (now > dailyResetAt) { dailyCount = 0; dailyResetAt = now + 86_400_000; }
    dailyCount += 1;
    if (dailyCount > perDay) return true;

    const entry = ipMap.get(ip);
    if (!entry || now > entry.resetAt) {
      ipMap.set(ip, { count: 1, resetAt: now + windowMs });
      return false;
    }
    entry.count += 1;
    return entry.count > perIp;
  };
}
