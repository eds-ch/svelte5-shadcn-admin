import { COOKIE } from '$lib/config';
import type { LayoutServerLoad } from './$types';

/** Return `value` if it's in the allowlist, otherwise `fallback`. */
function validated<T extends string>(
	value: string | undefined,
	allowed: readonly T[],
	fallback: T
): T {
	return allowed.includes(value as T) ? (value as T) : fallback;
}

export const load: LayoutServerLoad = ({ cookies }) => {
	return {
		sidebarOpen: cookies.get(COOKIE.sidebarState) !== 'false',
		sidebarCollapsible: validated(
			cookies.get(COOKIE.layoutCollapsible),
			COOKIE.valid.collapsible,
			COOKIE.defaults.collapsible
		),
		sidebarVariant: validated(
			cookies.get(COOKIE.layoutVariant),
			COOKIE.valid.variant,
			COOKIE.defaults.variant
		),
		font: validated(cookies.get(COOKIE.font), COOKIE.valid.font, COOKIE.defaults.font),
		themePreset: validated(
			cookies.get(COOKIE.themePreset),
			COOKIE.valid.themePreset,
			COOKIE.defaults.themePreset
		),
		colorMode: validated(
			cookies.get(COOKIE.colorMode),
			COOKIE.valid.colorMode,
			COOKIE.defaults.colorMode
		),
		viewApps: validated(
			cookies.get(COOKIE.viewApps),
			COOKIE.valid.viewApps,
			COOKIE.defaults.viewApps
		)
	};
};
