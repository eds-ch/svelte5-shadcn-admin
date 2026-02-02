import type { PaneGroupStorage } from 'paneforge';
import { COOKIE } from '$lib/config';

function getCookie(name: string): string | null {
	if (typeof document === 'undefined') return null;
	const prefix = `${name}=`;
	for (const part of document.cookie.split('; ')) {
		if (part.startsWith(prefix)) {
			return decodeURIComponent(part.slice(prefix.length));
		}
	}
	return null;
}

function setCookie(name: string, value: string): void {
	if (typeof document === 'undefined') return;
	document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${COOKIE.maxAge.long};samesite=lax`;
}

export const cookiePaneStorage: PaneGroupStorage = {
	getItem(name: string): string | null {
		return getCookie(`${COOKIE.panePrefix}${name}`);
	},
	setItem(name: string, value: string): void {
		setCookie(`${COOKIE.panePrefix}${name}`, value);
	}
};
