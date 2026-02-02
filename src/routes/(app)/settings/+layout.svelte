<script lang="ts">
	import type { Snippet } from 'svelte';
	import AppHeader from '$lib/components/layout/app-header.svelte';
	import Main from '$lib/components/layout/main.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import UserCog from '@lucide/svelte/icons/user-cog';
	import Wrench from '@lucide/svelte/icons/wrench';
	import Palette from '@lucide/svelte/icons/palette';
	import Bell from '@lucide/svelte/icons/bell';
	import Monitor from '@lucide/svelte/icons/monitor';
	import SettingsSidebarNav from './components/settings-sidebar-nav.svelte';
	import { m } from '$lib/paraglide/messages.js';

	let { children }: { children: Snippet } = $props();

	const sidebarNavItems = $derived([
		{ title: m.nav_profile(), href: '/settings', icon: UserCog },
		{ title: m.nav_account(), href: '/settings/account', icon: Wrench },
		{ title: m.nav_appearance(), href: '/settings/appearance', icon: Palette },
		{ title: m.nav_notifications(), href: '/settings/notifications', icon: Bell },
		{ title: m.nav_display(), href: '/settings/display', icon: Monitor }
	]);
</script>

<AppHeader />

<Main fixed>
	<div class="space-y-0.5">
		<h1 class="text-2xl font-bold tracking-tight md:text-3xl">{m.settings_title()}</h1>
		<p class="text-muted-foreground">
			{m.settings_desc()}
		</p>
	</div>
	<Separator class="my-4 lg:my-6" />
	<div
		class="flex min-h-0 flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12"
	>
		<aside class="top-0 lg:sticky lg:w-1/5">
			<SettingsSidebarNav items={sidebarNavItems} />
		</aside>
		<div class="flex w-full overflow-y-hidden p-1">
			{@render children()}
		</div>
	</div>
</Main>
