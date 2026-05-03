/**
 * @fileoverview Simple in-memory cache
 */

/**
 * A simple TTL-based in-memory cache.
 */
class SimpleCache {
  /**
   * @param {number} ttlMs - Default time-to-live in milliseconds
   */
  constructor(ttlMs) {
    this.ttlMs = ttlMs;
    this.store = new Map();
  }

  /**
   * Retrieves a value from the cache, if it exists and hasn't expired.
   * @param {string} key
   * @returns {any|null} The cached value, or null if expired/missing
   */
  get(key) {
    const entry = this.store.get(key);
    if (!entry) {
      return null;
    }
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  /**
   * Sets a value in the cache.
   * @param {string} key
   * @param {any} value
   * @param {number} [ttlOverrideMs] - Optional custom TTL for this entry
   */
  set(key, value, ttlOverrideMs) {
    const ttlMs = typeof ttlOverrideMs === "number" ? ttlOverrideMs : this.ttlMs;
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }
}

module.exports = SimpleCache;
