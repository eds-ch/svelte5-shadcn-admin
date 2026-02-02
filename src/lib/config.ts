export const APP_NAME = 'Vortex';

export function pageTitle(title: string): string {
	return `${title} | ${APP_NAME}`;
}

// Keys are duplicated in src/app.html (can't import $lib in inline scripts)
export const COOKIE = {
	sidebarState: 'sidebar:state',
	layoutCollapsible: 'layout_collapsible',
	layoutVariant: 'layout_variant',
	font: 'font',
	themePreset: 'theme_preset',
	colorMode: 'color_mode',
	viewApps: 'view_apps',
	panePrefix: 'pane:',
	maxAge: {
		long: 60 * 60 * 24 * 365, // 1 year — user preferences
		short: 60 * 60 * 24 * 7 // 7 days — transient UI state
	},
	valid: {
		font: ['inter', 'manrope', 'system'] as const,
		colorMode: ['light', 'dark', 'system'] as const,
		themePreset: ['default', 'modern-minimal', 'notebook', 'darkmatter'] as const,
		collapsible: ['offcanvas', 'icon', 'none'] as const,
		variant: ['inset', 'sidebar', 'floating'] as const,
		viewApps: ['grid', 'list'] as const
	},
	defaults: {
		sidebarOpen: true,
		collapsible: 'icon' as const,
		variant: 'inset' as const,
		font: 'inter',
		themePreset: 'default',
		colorMode: 'system' as const,
		viewApps: 'grid' as const
	}
} as const;

export const BREAKPOINT = { sm: 640, md: 768, lg: 1024 } as const;

export const PASSWORD_MIN_LENGTH = 8;
