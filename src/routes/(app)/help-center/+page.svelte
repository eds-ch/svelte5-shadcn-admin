<script lang="ts">
	import AppHeader from '$lib/components/layout/app-header.svelte';
	import Main from '$lib/components/layout/main.svelte';
	import Breadcrumbs from '$lib/components/shared/breadcrumbs.svelte';
	import Construction from '@lucide/svelte/icons/construction';
	import { m } from '$lib/paraglide/messages.js';
	import { pageTitle } from '$lib/config';
</script>

<svelte:head>
	<title>{pageTitle(m.nav_help_center())}</title>
</svelte:head>

<AppHeader>
	<Breadcrumbs />
</AppHeader>
<Main fixed class="gap-4">
	<div class="flex flex-1 flex-col items-center justify-center gap-2">
		<Construction size={48} class="text-muted-foreground" />
		<h1 class="text-2xl font-bold">Coming Soon</h1>
		<p class="text-muted-foreground text-center">
			This page has not been created yet. <br />
			Stay tuned though!
		</p>
	</div>
</Main>
