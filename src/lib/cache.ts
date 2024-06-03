import { unstable_cache as nextCache } from "next/cache";
import { cache as reactCache } from "react";

type Callback = (...args: any[]) => Promise<any>;

/**
 * Caches the result of a callback function using Next.js's cache and React's cache.
 * This helper function is created so we don't have to always import both
 * Next.js and React's caches and wrap both of them every time we need to cache.
 *
 * @param {Callback} cb - The callback function to be cached.
 * @param {string[]} keyParts - The parts of the cache key.
 * @param {Object} options - The options for cache revalidation and tags.
 * @param {number | false} options.revalidate - The time in seconds to revalidate the cache.
 * @param {string[]} options.tags - The tags for the cache.
 * @returns {Promise<any>} - The cached result of the callback function.
 */
export function cache<T extends Callback>(
	cb: T,
	keyParts: string[],
	options: { revalidate?: number | false; tags?: string[] } = {}
) {
	return nextCache(reactCache(cb), keyParts, options);
}
