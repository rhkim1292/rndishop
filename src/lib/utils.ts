import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges multiple class values into a single string using the `clsx` and `twMerge` functions.
 *
 * @param {...ClassValue[]} inputs - The class values to be merged.
 * @return {string} The merged class value string.
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
