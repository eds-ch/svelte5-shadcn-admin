<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
	import Plus from '@lucide/svelte/icons/plus';
	import { m } from '$lib/paraglide/messages.js';
	import { isMac } from '$lib/utils';
	import type { Team } from '$lib/data/types';

	let { teams }: { teams: Team[] } = $props();

	// teams is static data from the load function, so the initial value won't change.
	// svelte-ignore state_referenced_locally
	let activeTeam: Team = $state(teams[0]);

	const sidebar = Sidebar.useSidebar();
	const modifierKey = $derived(isMac() ? '\u2318' : 'Ctrl+');
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						{...props}
					>
						<div
							class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
						>
							<activeTeam.logo class="size-4" />
						</div>
						<div class="grid flex-1 text-start text-sm leading-tight">
							<span class="truncate font-semibold">{activeTeam.name}</span>
							<span class="truncate text-xs">{activeTeam.plan}</span>
						</div>
						<ChevronsUpDown class="ms-auto" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
				align="start"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				sideOffset={4}
			>
				<DropdownMenu.Label class="text-muted-foreground text-xs">
					{m.teams_label()}
				</DropdownMenu.Label>
				{#each teams as team, index (team.name)}
					<DropdownMenu.Item class="gap-2 p-2" onSelect={() => (activeTeam = team)}>
						<div class="flex size-6 items-center justify-center rounded-sm border">
							<team.logo class="size-4 shrink-0" />
						</div>
						{team.name}
						<DropdownMenu.Shortcut>{modifierKey}{index + 1}</DropdownMenu.Shortcut>
					</DropdownMenu.Item>
				{/each}
				<DropdownMenu.Separator />
				<DropdownMenu.Item class="gap-2 p-2">
					<div class="bg-background flex size-6 items-center justify-center rounded-md border">
						<Plus class="size-4" />
					</div>
					<div class="text-muted-foreground font-medium">{m.teams_add()}</div>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
