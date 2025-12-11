/**
 * MetroPortal - In-Memory Cache Service
 * Provides caching layer for DMRC API responses
 */

class CacheService {
    constructor() {
        this.cache = new Map();
        this.defaultTTL = parseInt(process.env.CACHE_TTL) || 25; // seconds
    }

    /**
     * Set a value in cache with TTL
     * @param {string} key - Cache key
     * @param {any} value - Value to cache
     * @param {number} ttl - Time to live in seconds (optional)
     */
    set(key, value, ttl = this.defaultTTL) {
        const expiresAt = Date.now() + (ttl * 1000);
        this.cache.set(key, {
            value,
            expiresAt,
            createdAt: Date.now()
        });
        console.log(`[Cache] SET: ${key} (TTL: ${ttl}s)`);
    }

    /**
     * Get a value from cache
     * @param {string} key - Cache key
     * @returns {any|null} - Cached value or null if expired/missing
     */
    get(key) {
        const item = this.cache.get(key);

        if (!item) {
            console.log(`[Cache] MISS: ${key}`);
            return null;
        }

        if (Date.now() > item.expiresAt) {
            console.log(`[Cache] EXPIRED: ${key}`);
            this.cache.delete(key);
            return null;
        }

        const ageSeconds = ((Date.now() - item.createdAt) / 1000).toFixed(1);
        console.log(`[Cache] HIT: ${key} (age: ${ageSeconds}s)`);
        return item.value;
    }

    /**
     * Check if a key exists and is not expired
     * @param {string} key - Cache key
     * @returns {boolean}
     */
    has(key) {
        const item = this.cache.get(key);
        if (!item) return false;
        if (Date.now() > item.expiresAt) {
            this.cache.delete(key);
            return false;
        }
        return true;
    }

    /**
     * Delete a key from cache
     * @param {string} key - Cache key
     */
    delete(key) {
        this.cache.delete(key);
        console.log(`[Cache] DELETE: ${key}`);
    }

    /**
     * Clear all cached data
     */
    clear() {
        this.cache.clear();
        console.log('[Cache] CLEARED all entries');
    }

    /**
     * Get cache statistics
     * @returns {object} - Cache stats
     */
    getStats() {
        let validCount = 0;
        let expiredCount = 0;
        const now = Date.now();

        for (const [key, item] of this.cache.entries()) {
            if (now > item.expiresAt) {
                expiredCount++;
            } else {
                validCount++;
            }
        }

        return {
            totalEntries: this.cache.size,
            validEntries: validCount,
            expiredEntries: expiredCount,
            defaultTTL: this.defaultTTL
        };
    }

    /**
     * Clean up expired entries
     */
    cleanup() {
        const now = Date.now();
        let cleaned = 0;

        for (const [key, item] of this.cache.entries()) {
            if (now > item.expiresAt) {
                this.cache.delete(key);
                cleaned++;
            }
        }

        if (cleaned > 0) {
            console.log(`[Cache] Cleanup: removed ${cleaned} expired entries`);
        }
    }
}

// Export singleton instance
const cacheService = new CacheService();
export default cacheService;
