/**
 * Build script: converts tweakcn hex theme presets to OkLCH CSS custom properties.
 *
 * Run with: npx tsx src/lib/themes/generate-presets.ts
 *
 * Reads: reference/tweakcn/utils/theme-presets.ts (hex color presets)
 * Writes:
 *   - src/lib/themes/presets.css   (CSS with [data-preset] selectors)
 *   - src/lib/themes/preset-data.ts (preset metadata for UI rendering)
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as culori from 'culori';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Only these presets will be included in the generated output.
 * The 'default' theme is always included (uses base app.css styles, not preset CSS).
 * To add a preset, add its key name from the tweakcn source file to this set.
 */
const ALLOWED_PRESETS = new Set(['modern-minimal', 'notebook', 'darkmatter']);

// ---------------------------------------------------------------------------
// 1. Default theme styles (from reference/tweakcn/config/theme.ts)
// ---------------------------------------------------------------------------

const defaultLightThemeStyles: Record<string, string> = {
	background: 'oklch(1 0 0)',
	foreground: 'oklch(0.145 0 0)',
	card: 'oklch(1 0 0)',
	'card-foreground': 'oklch(0.145 0 0)',
	popover: 'oklch(1 0 0)',
	'popover-foreground': 'oklch(0.145 0 0)',
	primary: 'oklch(0.205 0 0)',
	'primary-foreground': 'oklch(0.985 0 0)',
	secondary: 'oklch(0.97 0 0)',
	'secondary-foreground': 'oklch(0.205 0 0)',
	muted: 'oklch(0.97 0 0)',
	'muted-foreground': 'oklch(0.556 0 0)',
	accent: 'oklch(0.97 0 0)',
	'accent-foreground': 'oklch(0.205 0 0)',
	destructive: 'oklch(0.577 0.245 27.325)',
	'destructive-foreground': 'oklch(1 0 0)',
	border: 'oklch(0.922 0 0)',
	input: 'oklch(0.922 0 0)',
	ring: 'oklch(0.708 0 0)',
	'chart-1': 'oklch(0.81 0.10 252)',
	'chart-2': 'oklch(0.62 0.19 260)',
	'chart-3': 'oklch(0.55 0.22 263)',
	'chart-4': 'oklch(0.49 0.22 264)',
	'chart-5': 'oklch(0.42 0.18 266)',
	radius: '0.625rem',
	sidebar: 'oklch(0.985 0 0)',
	'sidebar-foreground': 'oklch(0.145 0 0)',
	'sidebar-primary': 'oklch(0.205 0 0)',
	'sidebar-primary-foreground': 'oklch(0.985 0 0)',
	'sidebar-accent': 'oklch(0.97 0 0)',
	'sidebar-accent-foreground': 'oklch(0.205 0 0)',
	'sidebar-border': 'oklch(0.922 0 0)',
	'sidebar-ring': 'oklch(0.708 0 0)'
};

const defaultDarkThemeStyles: Record<string, string> = {
	...defaultLightThemeStyles,
	background: 'oklch(0.145 0 0)',
	foreground: 'oklch(0.985 0 0)',
	card: 'oklch(0.205 0 0)',
	'card-foreground': 'oklch(0.985 0 0)',
	popover: 'oklch(0.269 0 0)',
	'popover-foreground': 'oklch(0.985 0 0)',
	primary: 'oklch(0.922 0 0)',
	'primary-foreground': 'oklch(0.205 0 0)',
	secondary: 'oklch(0.269 0 0)',
	'secondary-foreground': 'oklch(0.985 0 0)',
	muted: 'oklch(0.269 0 0)',
	'muted-foreground': 'oklch(0.708 0 0)',
	accent: 'oklch(0.371 0 0)',
	'accent-foreground': 'oklch(0.985 0 0)',
	destructive: 'oklch(0.704 0.191 22.216)',
	'destructive-foreground': 'oklch(0.985 0 0)',
	border: 'oklch(0.275 0 0)',
	input: 'oklch(0.325 0 0)',
	ring: 'oklch(0.556 0 0)',
	'chart-1': 'oklch(0.81 0.10 252)',
	'chart-2': 'oklch(0.62 0.19 260)',
	'chart-3': 'oklch(0.55 0.22 263)',
	'chart-4': 'oklch(0.49 0.22 264)',
	'chart-5': 'oklch(0.42 0.18 266)',
	sidebar: 'oklch(0.205 0 0)',
	'sidebar-foreground': 'oklch(0.985 0 0)',
	'sidebar-primary': 'oklch(0.42 0.24 264.376)',
	'sidebar-primary-foreground': 'oklch(0.985 0 0)',
	'sidebar-accent': 'oklch(0.269 0 0)',
	'sidebar-accent-foreground': 'oklch(0.985 0 0)',
	'sidebar-border': 'oklch(0.275 0 0)',
	'sidebar-ring': 'oklch(0.439 0 0)'
};

// ---------------------------------------------------------------------------
// 2. CSS variable properties we care about
// ---------------------------------------------------------------------------

const COLOR_PROPS = [
	'background',
	'foreground',
	'card',
	'card-foreground',
	'popover',
	'popover-foreground',
	'primary',
	'primary-foreground',
	'secondary',
	'secondary-foreground',
	'muted',
	'muted-foreground',
	'accent',
	'accent-foreground',
	'destructive',
	'destructive-foreground',
	'border',
	'input',
	'ring',
	'chart-1',
	'chart-2',
	'chart-3',
	'chart-4',
	'chart-5',
	'sidebar',
	'sidebar-foreground',
	'sidebar-primary',
	'sidebar-primary-foreground',
	'sidebar-accent',
	'sidebar-accent-foreground',
	'sidebar-border',
	'sidebar-ring'
];

const PASSTHROUGH_PROPS = ['radius'];

// ---------------------------------------------------------------------------
// 3. Color conversion
// ---------------------------------------------------------------------------

function formatNum(num: number | undefined | null): string {
	if (num == null || Number.isNaN(num)) return '0';
	return num % 1 === 0 ? String(num) : num.toFixed(4);
}

function toOklch(colorValue: string): string {
	if (colorValue.startsWith('oklch(')) return colorValue;

	const parsed = culori.parse(colorValue);
	if (!parsed) {
		console.warn(`  WARNING: Could not parse color "${colorValue}", passing through`);
		return colorValue;
	}
	const oklch = culori.converter('oklch')(parsed);
	return `oklch(${formatNum(oklch.l)} ${formatNum(oklch.c)} ${formatNum(oklch.h)})`;
}

// ---------------------------------------------------------------------------
// 4. Parse preset data from the reference file using regex extraction
// ---------------------------------------------------------------------------

interface PresetStyle {
	[key: string]: string;
}

interface PresetDef {
	label?: string;
	styles: {
		light: PresetStyle;
		dark?: PresetStyle;
	};
}

function extractStyleBlock(presetBlock: string, mode: 'light' | 'dark'): PresetStyle | null {
	const modeRegex = new RegExp(`${mode}:\\s*\\{`);
	const modeMatch = modeRegex.exec(presetBlock);
	if (!modeMatch) return null;

	let depth = 1;
	let pos = modeMatch.index + modeMatch[0].length;
	const startPos = pos;

	while (pos < presetBlock.length && depth > 0) {
		if (presetBlock[pos] === '{') depth++;
		if (presetBlock[pos] === '}') depth--;
		pos++;
	}

	const styleContent = presetBlock.substring(startPos, pos - 1);

	const styles: PresetStyle = {};
	const kvRegex = /["']?([a-z][a-z0-9-]*)["']?\s*:\s*["']([^"']+)["']/g;
	let kvMatch;

	while ((kvMatch = kvRegex.exec(styleContent)) !== null) {
		styles[kvMatch[1]] = kvMatch[2];
	}

	return Object.keys(styles).length > 0 ? styles : null;
}

function parsePresetsFromSource(content: string): Record<string, PresetDef> {
	const presets: Record<string, PresetDef> = {};

	// Match both quoted ("preset-name":) and unquoted (presetname:) top-level keys
	// Top-level keys are at 2-space indent in the defaultPresets object
	const presetKeyRegex = /^\s{2}(?:"([a-z][a-z0-9-]*)"|([a-z][a-z0-9]*)):\s*\{/gm;
	let match;
	const presetPositions: { name: string; start: number }[] = [];

	// These keys appear inside preset objects, not as preset names
	const NESTED_KEYS = new Set(['styles', 'light', 'dark']);

	while ((match = presetKeyRegex.exec(content)) !== null) {
		const name = match[1] || match[2];
		if (!NESTED_KEYS.has(name)) {
			presetPositions.push({ name, start: match.index });
		}
	}

	for (let i = 0; i < presetPositions.length; i++) {
		const { name, start } = presetPositions[i];
		const end = i < presetPositions.length - 1 ? presetPositions[i + 1].start : content.length;
		const block = content.substring(start, end);

		const labelMatch = block.match(/label:\s*"([^"]+)"/);
		const label = labelMatch ? labelMatch[1] : name;

		const lightStyles = extractStyleBlock(block, 'light');
		const darkStyles = extractStyleBlock(block, 'dark');

		if (lightStyles) {
			presets[name] = {
				label,
				styles: {
					light: lightStyles,
					dark: darkStyles || undefined
				}
			};
		}
	}

	return presets;
}

// ---------------------------------------------------------------------------
// 5. Merge preset with defaults
// ---------------------------------------------------------------------------

function mergePresetWithDefaults(presetStyles: { light: PresetStyle; dark?: PresetStyle }): {
	light: Record<string, string>;
	dark: Record<string, string>;
} {
	return {
		light: {
			...defaultLightThemeStyles,
			...(presetStyles.light || {})
		},
		dark: {
			...defaultDarkThemeStyles,
			...(presetStyles.light || {}),
			...(presetStyles.dark || {})
		}
	};
}

// ---------------------------------------------------------------------------
// 6. Generate CSS
// ---------------------------------------------------------------------------

function generateCssBlock(selector: string, styles: Record<string, string>): string {
	const lines: string[] = [];
	lines.push(`${selector} {`);

	for (const prop of COLOR_PROPS) {
		const value = styles[prop];
		if (value !== undefined) {
			lines.push(`  --${prop}: ${toOklch(value)};`);
		}
	}

	for (const prop of PASSTHROUGH_PROPS) {
		const value = styles[prop];
		if (value !== undefined) {
			lines.push(`  --${prop}: ${value};`);
		}
	}

	lines.push('}');
	return lines.join('\n');
}

function generatePresetsCSS(presets: Record<string, PresetDef>): string {
	const blocks: string[] = [];

	blocks.push('/* Auto-generated by generate-presets.ts -- DO NOT EDIT */');
	blocks.push('/* Run: npx tsx src/lib/themes/generate-presets.ts */');
	blocks.push('');

	const presetEntries = Object.entries(presets);
	console.log(`Processing ${presetEntries.length} presets...`);

	for (const [name, preset] of presetEntries) {
		const merged = mergePresetWithDefaults(preset.styles);

		const lightSelector = `:root[data-preset="${name}"]`;
		blocks.push(generateCssBlock(lightSelector, merged.light));
		blocks.push('');

		const darkSelector = `.dark[data-preset="${name}"]`;
		blocks.push(generateCssBlock(darkSelector, merged.dark));
		blocks.push('');

		console.log(`  - ${name} (${preset.label || name})`);
	}

	return blocks.join('\n');
}

// ---------------------------------------------------------------------------
// 7. Generate preset-data.ts metadata
// ---------------------------------------------------------------------------

function generatePresetDataTS(presets: Record<string, PresetDef>): string {
	const lines: string[] = [];

	lines.push('// Auto-generated by generate-presets.ts -- DO NOT EDIT');
	lines.push('// Run: npx tsx src/lib/themes/generate-presets.ts');
	lines.push('');
	lines.push('export type PresetMeta = {');
	lines.push('\tname: string;');
	lines.push('\tlabel: string;');
	lines.push('\tprimaryColor: string;');
	lines.push('\tsecondaryColor: string;');
	lines.push('\tprimaryForegroundColor: string;');
	lines.push('};');
	lines.push('');
	lines.push('export const presets: readonly PresetMeta[] = [');

	lines.push('\t{');
	lines.push(`\t\tname: 'default',`);
	lines.push(`\t\tlabel: 'Default',`);
	lines.push(`\t\tprimaryColor: '${defaultLightThemeStyles.primary}',`);
	lines.push(`\t\tsecondaryColor: '${defaultLightThemeStyles.secondary}',`);
	lines.push(`\t\tprimaryForegroundColor: '${defaultLightThemeStyles['primary-foreground']}'`);
	lines.push('\t},');

	for (const [name, preset] of Object.entries(presets)) {
		const merged = mergePresetWithDefaults(preset.styles);
		const primaryOklch = toOklch(merged.light.primary);
		const secondaryOklch = toOklch(merged.light.secondary);
		const primaryFgOklch = toOklch(merged.light['primary-foreground']);

		lines.push('\t{');
		lines.push(`\t\tname: '${name}',`);
		lines.push(`\t\tlabel: '${(preset.label || name).replace(/'/g, "\\'")}',`);
		lines.push(`\t\tprimaryColor: '${primaryOklch}',`);
		lines.push(`\t\tsecondaryColor: '${secondaryOklch}',`);
		lines.push(`\t\tprimaryForegroundColor: '${primaryFgOklch}'`);
		lines.push('\t},');
	}

	lines.push('];');
	lines.push('');

	return lines.join('\n');
}

// ---------------------------------------------------------------------------
// 8. Main
// ---------------------------------------------------------------------------

function main() {
	console.log('Loading tweakcn presets...');

	const sourcePath = path.resolve(__dirname, '../../../reference/tweakcn/utils/theme-presets.ts');
	const sourceContent = fs.readFileSync(sourcePath, 'utf-8');
	const presets = parsePresetsFromSource(sourceContent);

	const presetCount = Object.keys(presets).length;
	console.log(`Found ${presetCount} presets`);

	// Filter to allowed presets only
	const filtered: Record<string, PresetDef> = {};
	for (const [name, def] of Object.entries(presets)) {
		if (ALLOWED_PRESETS.has(name)) {
			filtered[name] = def;
		}
	}
	console.log(`Filtered to ${Object.keys(filtered).length} presets (+ default)`);

	console.log('\nGenerating presets.css...');
	const css = generatePresetsCSS(filtered);
	const cssPath = path.resolve(__dirname, 'presets.css');
	fs.writeFileSync(cssPath, css, 'utf-8');
	console.log(`Wrote ${cssPath}`);

	console.log('\nGenerating preset-data.ts...');
	const tsContent = generatePresetDataTS(filtered);
	const tsPath = path.resolve(__dirname, 'preset-data.ts');
	fs.writeFileSync(tsPath, tsContent, 'utf-8');
	console.log(`Wrote ${tsPath}`);

	console.log('\nDone!');
}

main();
