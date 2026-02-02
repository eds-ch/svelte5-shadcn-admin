<script lang="ts">
	import type { Component } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { cn } from '$lib/utils';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { localizeHref, deLocalizeHref } from '$lib/paraglide/runtime.js';
	import { m } from '$lib/paraglide/messages.js';

	type NavItem = {
		title: string;
		href: string;
		icon?: Component;
	};

	let { items }: { items: NavItem[] } = $props();

	let pathname = $derived(deLocalizeHref(page.url.pathname));
</script>

<div class="p-1 lg:hidden">
	<Select.Root
		type="single"
		value={pathname}
		onValueChange={(v) => {
			if (v) goto(localizeHref(v));
		}}
	>
		<Select.Trigger class="h-12 sm:w-48">
			{items.find((item) => item.href === pathname)?.title ?? m.settings_navigate()}
		</Select.Trigger>
		<Select.Content>
			{#each items as item (item.href)}
				<Select.Item value={item.href}>
					<div class="flex gap-x-4 px-2 py-1">
						{#if item.icon}
							{@const Icon = item.icon}
							<span class="scale-125">
								<Icon size={18} />
							</span>
						{/if}
						<span class="text-md">{item.title}</span>
					</div>
				</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
</div>

<nav class="bg-background hidden w-full min-w-40 space-y-1 px-1 py-2 lg:block">
	{#each items as item (item.href)}
		<a
			href={localizeHref(item.href)}
			class={cn(
				buttonVariants({ variant: 'ghost' }),
				'w-full justify-start',
				pathname === item.href ? 'bg-muted hover:bg-accent' : 'hover:bg-accent hover:underline'
			)}
		>
			{#if item.icon}
				{@const Icon = item.icon}
				<span class="me-2">
					<Icon size={18} />
				</span>
			{/if}
			{item.title}
		</a>
	{/each}
</nav>
