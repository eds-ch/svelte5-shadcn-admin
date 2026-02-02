import { createContext } from 'svelte';
import { MediaQuery } from 'svelte/reactivity';
import { presets } from '$lib/themes/preset-data';
import { COOKIE } from '$lib/config';

const validPresetNames = new Set(presets.map((p) => p.name));

export type ColorMode = 'light' | 'dark' | 'system';

export class ThemeState {
	static readonly validModes: ColorMode[] = ['light', 'dark', 'system'];

	readonly defaultPreset: string = COOKIE.defaults.themePreset;
	readonly defaultFont: string = COOKIE.defaults.font;

	preset: string = $state(COOKIE.defaults.themePreset);
	font: string = $state(COOKIE.defaults.font);
	mode: ColorMode = $state(COOKIE.defaults.colorMode);
	#systemDark: MediaQuery;
	#currentFontClass: string | null = null;

	resolvedMode = $derived.by((): 'light' | 'dark' => {
		if (this.mode === 'system') {
			return this.#systemDark.current ? 'dark' : 'light';
		}
		return this.mode;
	});

	constructor(initial: { preset: string; font: string; mode: string }) {
		this.preset = validPresetNames.has(initial.preset) ? initial.preset : this.defaultPreset;
		this.font = initial.font || this.defaultFont;
		this.mode = ThemeState.validModes.includes(initial.mode as ColorMode)
			? (initial.mode as ColorMode)
			: COOKIE.defaults.colorMode;
		this.#systemDark = new MediaQuery('prefers-color-scheme: dark', false);
		// Track the font class applied by app.html inline script
		this.#currentFontClass = this.font !== 'system' ? `font-${this.font}` : null;
	}

	setPreset = (name: string) => {
		this.preset = name;
		if (name === COOKIE.defaults.themePreset) {
			document.documentElement.removeAttribute('data-preset');
		} else {
			document.documentElement.dataset.preset = name;
		}
		document.cookie = `${COOKIE.themePreset}=${name}; path=/; max-age=${COOKIE.maxAge.long}; SameSite=Lax`;
	};

	setFont = (name: string) => {
		this.font = name;
		// Remove only the previously tracked font class (avoids stripping font-bold etc.)
		if (this.#currentFontClass) {
			document.documentElement.classList.remove(this.#currentFontClass);
			this.#currentFontClass = null;
		}
		// Add new font class (unless system default)
		if (name !== 'system') {
			const cls = `font-${name}`;
			document.documentElement.classList.add(cls);
			this.#currentFontClass = cls;
		}
		document.cookie = `${COOKIE.font}=${name}; path=/; max-age=${COOKIE.maxAge.long}; SameSite=Lax`;
	};

	setMode = (value: ColorMode) => {
		this.mode = value;
		document.cookie = `${COOKIE.colorMode}=${value}; path=/; max-age=${COOKIE.maxAge.long}; SameSite=Lax`;
	};

	reset = () => {
		this.setPreset(this.defaultPreset);
		this.setFont(this.defaultFont);
		this.setMode(COOKIE.defaults.colorMode);
	};
}

export const [getTheme, setTheme] = createContext<ThemeState>();
