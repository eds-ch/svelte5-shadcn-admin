<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Toaster } from '$lib/components/ui/sonner';
	import NavigationProgress from '$lib/components/shared/navigation-progress.svelte';
	import CommandMenu from '$lib/components/shared/command-menu.svelte';
	import { LayoutState, setLayout } from '$lib/contexts/layout.svelte';
	import { SearchState, setSearch } from '$lib/contexts/search.svelte';
	import { ThemeState, setTheme } from '$lib/contexts/theme.svelte';
	import { ShortcutRegistry, setShortcuts } from '$lib/contexts/shortcuts.svelte';
	import ShortcutsHelpDialog from '$lib/components/shared/shortcuts-help-dialog.svelte';
	import { m } from '$lib/paraglide/messages.js';

	let { data, children } = $props();

	// svelte-ignore state_referenced_locally
	const layout = new LayoutState({
		collapsible: data.sidebarCollapsible,
		variant: data.sidebarVariant
	});
	setLayout(layout);

	const search = new SearchState();
	setSearch(search);

	// svelte-ignore state_referenced_locally
	const theme = new ThemeState({
		preset: data.themePreset,
		font: data.font,
		mode: data.colorMode
	});
	setTheme(theme);

	const shortcuts = new ShortcutRegistry();
	setShortcuts(shortcuts);

	$effect(() => {
		document.documentElement.classList.toggle('dark', theme.resolvedMode === 'dark');
	});

	$effect(() => {
		return shortcuts.register([
			{
				key: 'k',
				modifiers: ['ctrl'],
				label: m.shortcut_command_palette(),
				action: () => search.toggle(),
				scope: 'global'
			},
			{
				key: 'd',
				modifiers: ['ctrl'],
				label: m.shortcut_toggle_theme(),
				action: () => theme.setMode(theme.resolvedMode === 'dark' ? 'light' : 'dark'),
				scope: 'global'
			},
			{
				key: '?',
				label: m.shortcut_show_help(),
				action: () => (shortcuts.helpOpen = true),
				scope: 'global'
			}
		]);
	});
</script>

<svelte:window onkeydown={shortcuts.handleKeydown} />

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Toaster theme={theme.resolvedMode} />
<NavigationProgress />
<CommandMenu />
<ShortcutsHelpDialog />

{@render children()}
