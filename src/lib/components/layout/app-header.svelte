<script lang="ts">
	import type { Snippet } from 'svelte';
	import Header from './header.svelte';
	import SearchTrigger from '$lib/components/shared/search-trigger.svelte';
	import ThemeSwitch from '$lib/components/shared/theme-switch.svelte';
	import LocaleSwitcher from '$lib/components/shared/locale-switcher.svelte';
	import ConfigDrawer from '$lib/components/shared/config-drawer.svelte';
	import ProfileDropdown from '$lib/components/shared/profile-dropdown.svelte';

	let {
		fixed = true,
		children
	}: {
		fixed?: boolean;
		children?: Snippet;
	} = $props();
</script>

<Header {fixed}>
	{#if children}
		{@render children()}
		<div class="ms-auto flex items-center gap-4">
			<SearchTrigger />
			<LocaleSwitcher />
			<ThemeSwitch />
			<ConfigDrawer />
			<ProfileDropdown />
		</div>
	{:else}
		<SearchTrigger />
		<div class="ms-auto flex items-center gap-4">
			<LocaleSwitcher />
			<ThemeSwitch />
			<ConfigDrawer />
			<ProfileDropdown />
		</div>
	{/if}
</Header>
