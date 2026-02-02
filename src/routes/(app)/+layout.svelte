<script lang="ts">
	import { online } from 'svelte/reactivity/window';
	import WifiOff from '@lucide/svelte/icons/wifi-off';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import AppSidebar from '$lib/components/layout/app-sidebar.svelte';
	import SkipToMain from '$lib/components/layout/skip-to-main.svelte';
	import ScrollToTop from '$lib/components/shared/scroll-to-top.svelte';
	import { getLayout } from '$lib/contexts/layout.svelte';
	import { setAppData } from '$lib/contexts/app.svelte';
	import { cn } from '$lib/utils';
	import { m } from '$lib/paraglide/messages.js';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();

	setAppData({
		get currentUser() {
			return data.currentUser;
		},
		get teams() {
			return data.teams;
		}
	});

	const layout = getLayout();
</script>

<Sidebar.Provider open={data.sidebarOpen}>
	<SkipToMain />
	<AppSidebar collapsible={layout.collapsible} variant={layout.variant} />
	<Sidebar.Inset
		class={cn(
			'@container/content',
			'has-data-[layout=fixed]:h-svh',
			'peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]'
		)}
	>
		{#if online.current === false}
			<div
				class="bg-destructive text-destructive-foreground flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium"
				role="alert"
				aria-live="assertive"
			>
				<WifiOff class="size-4" />
				{m.common_offline_message()}
			</div>
		{/if}
		{@render children()}
		<ScrollToTop />
	</Sidebar.Inset>
</Sidebar.Provider>
