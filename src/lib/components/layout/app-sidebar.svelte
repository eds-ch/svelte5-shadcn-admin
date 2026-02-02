<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { getNavGroups } from '$lib/data/nav-config';
	import { getAppData } from '$lib/contexts/app.svelte';
	import TeamSwitcher from './team-switcher.svelte';
	import NavGroup from './nav-group.svelte';
	import NavUser from './nav-user.svelte';
	import type { Collapsible, Variant } from '$lib/contexts/layout.svelte';

	let {
		collapsible = 'icon',
		variant = 'sidebar'
	}: {
		collapsible?: Collapsible;
		variant?: Variant;
	} = $props();

	const app = getAppData();
</script>

<nav aria-label="Main navigation">
	<Sidebar.Root {collapsible} {variant}>
		<Sidebar.Header>
			<TeamSwitcher teams={app.teams} />
		</Sidebar.Header>
		<Sidebar.Content>
			{#each getNavGroups() as group (group.title)}
				<NavGroup title={group.title} items={group.items} />
			{/each}
		</Sidebar.Content>
		<Sidebar.Footer>
			<NavUser user={app.currentUser} />
		</Sidebar.Footer>
		<Sidebar.Rail />
	</Sidebar.Root>
</nav>
