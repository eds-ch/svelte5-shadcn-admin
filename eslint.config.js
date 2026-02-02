import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default ts.config(
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs.prettier,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_'
				}
			],
			// Paraglide's localizeHref() handles URL resolution instead of $app/paths resolve()
			'svelte/no-navigation-without-resolve': 'off',
			// {@html} is used intentionally for trusted i18n strings with markup
			'svelte/no-at-html-tags': 'warn'
		}
	},
	{
		files: ['**/*.d.ts'],
		rules: {
			// SvelteKit convention: empty interfaces in app.d.ts are placeholders
			'@typescript-eslint/no-empty-object-type': 'off'
		}
	},
	{
		ignores: [
			'build/',
			'dist/',
			'.svelte-kit/',
			'src/lib/paraglide/',
			'src/paraglide/',
			'reference/',
			'docs/',
			'temp/'
		]
	}
);
