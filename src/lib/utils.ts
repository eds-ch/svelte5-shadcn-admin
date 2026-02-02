import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/** SSR-safe: returns false on the server. */
export function isMac(): boolean {
	if (typeof navigator === 'undefined') return false;
	// Modern API (Chromium-based browsers)
	if ('userAgentData' in navigator && navigator.userAgentData) {
		return (
			(navigator as Navigator & { userAgentData: { platform: string } }).userAgentData.platform ===
			'macOS'
		);
	}
	// Fallback for Safari/Firefox
	return /Mac|iPhone|iPod|iPad/.test(navigator.platform);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
