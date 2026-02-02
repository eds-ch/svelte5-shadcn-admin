<script lang="ts">
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Menu from '@lucide/svelte/icons/menu';
	import { m } from '$lib/paraglide/messages.js';

	interface TopNavLink {
		title: string;
		href: string;
		isActive: boolean;
		disabled?: boolean;
	}

	let {
		links,
		class: className
	}: {
		links: TopNavLink[];
		class?: string;
	} = $props();
</script>

<div class="lg:hidden">
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button size="icon" variant="outline" class="md:size-7" {...props}>
					<Menu />
					<span class="sr-only">{m.common_navigation_menu()}</span>
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content side="bottom" align="start">
			{#each links as link (link.title)}
				{#if link.disabled}
					<DropdownMenu.Item disabled>
						<span class="text-muted-foreground">{link.title}</span>
					</DropdownMenu.Item>
				{:else}
					<DropdownMenu.Item>
						<a href={link.href} class={cn(!link.isActive && 'text-muted-foreground')}>
							{link.title}
						</a>
					</DropdownMenu.Item>
				{/if}
			{/each}
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>

<nav class={cn('hidden items-center gap-4 lg:flex xl:gap-6', className)}>
	{#each links as link (link.title)}
		{#if link.disabled}
			<span class="text-muted-foreground text-sm font-medium">
				{link.title}
			</span>
		{:else}
			<a
				href={link.href}
				class={cn(
					'hover:text-primary text-sm font-medium transition-colors',
					!link.isActive && 'text-muted-foreground'
				)}
			>
				{link.title}
			</a>
		{/if}
	{/each}
</nav>
