<script lang="ts" generics="TData, TValue">
	import CirclePlusIcon from '@lucide/svelte/icons/circle-plus';
	import CheckIcon from '@lucide/svelte/icons/check';
	import type { Column } from '@tanstack/table-core';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { cn } from '$lib/utils.js';
	import type { Component } from 'svelte';
	import { m } from '$lib/paraglide/messages.js';

	let {
		column,
		title,
		options
	}: {
		column: Column<TData, TValue>;
		title: string;
		options: {
			label: string;
			value: string;
			icon?: Component;
		}[];
	} = $props();

	const facets = $derived(column.getFacetedUniqueValues());
	const selectedValues = $derived(new Set(column.getFilterValue() as string[] | undefined));
</script>

<Popover.Root>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline" size="sm" class="h-8 border-dashed">
				<CirclePlusIcon />
				{title}
				{#if selectedValues.size > 0}
					<Separator orientation="vertical" class="mx-2 h-4" />
					<Badge variant="secondary" class="rounded-sm px-1 font-normal lg:hidden">
						{selectedValues.size}
					</Badge>
					<div class="hidden space-x-1 lg:flex">
						{#if selectedValues.size > 2}
							<Badge variant="secondary" class="rounded-sm px-1 font-normal">
								{m.table_n_selected({ count: String(selectedValues.size) })}
							</Badge>
						{:else}
							{#each options.filter( (opt) => selectedValues.has(opt.value) ) as option (option.value)}
								<Badge variant="secondary" class="rounded-sm px-1 font-normal">
									{option.label}
								</Badge>
							{/each}
						{/if}
					</div>
				{/if}
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-[200px] p-0" align="start">
		<Command.Root>
			<Command.Input placeholder={title} aria-label={title} />
			<Command.List>
				<Command.Empty>{m.cmd_no_results()}</Command.Empty>
				<Command.Group>
					{#each options as option (option.value)}
						{@const isSelected = selectedValues.has(option.value)}
						<Command.Item
							onSelect={() => {
								// eslint-disable-next-line svelte/prefer-svelte-reactivity -- temporary local Set, not reactive state
								const next = new Set(selectedValues);
								if (isSelected) {
									next.delete(option.value);
								} else {
									next.add(option.value);
								}
								const filterValues = Array.from(next);
								column.setFilterValue(filterValues.length ? filterValues : undefined);
							}}
						>
							<div
								class={cn(
									'border-primary me-2 flex size-4 items-center justify-center rounded-sm border',
									isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
								)}
							>
								<CheckIcon class="size-4" />
							</div>
							{#if option.icon}
								{@const Icon = option.icon}
								<Icon class="text-muted-foreground" />
							{/if}
							<span>{option.label}</span>
							{#if facets?.get(option.value)}
								<span class="ms-auto flex size-4 items-center justify-center font-mono text-xs">
									{facets.get(option.value)}
								</span>
							{/if}
						</Command.Item>
					{/each}
				</Command.Group>
				{#if selectedValues.size > 0}
					<Command.Separator />
					<Command.Group>
						<Command.Item
							onSelect={() => column.setFilterValue(undefined)}
							class="justify-center text-center"
						>
							{m.table_clear_filters()}
						</Command.Item>
					</Command.Group>
				{/if}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
