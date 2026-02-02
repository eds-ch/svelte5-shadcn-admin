<script lang="ts" generics="TData">
	import XIcon from '@lucide/svelte/icons/x';
	import type { Table } from '@tanstack/table-core';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { Snippet } from 'svelte';
	import { m } from '$lib/paraglide/messages.js';

	let {
		table,
		children,
		actions
	}: {
		table: Table<TData>;
		children?: Snippet;
		actions?: Snippet;
	} = $props();

	const isFiltered = $derived(
		table.getState().columnFilters.length > 0 || !!table.getState().globalFilter
	);
</script>

<div role="toolbar" class="flex items-center justify-between">
	<div
		class="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2"
	>
		{#if children}
			{@render children()}
		{/if}
		{#if isFiltered}
			<Button
				variant="ghost"
				onclick={() => {
					table.resetColumnFilters();
					table.setGlobalFilter('');
				}}
				class="h-8 px-2 lg:px-3"
			>
				{m.table_reset()}
				<XIcon class="ms-2 size-4" />
			</Button>
		{/if}
	</div>
	{#if actions}
		{@render actions()}
	{/if}
</div>
