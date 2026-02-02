<script lang="ts" generics="TData">
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import ChevronsLeftIcon from '@lucide/svelte/icons/chevrons-left';
	import ChevronsRightIcon from '@lucide/svelte/icons/chevrons-right';
	import { innerWidth } from 'svelte/reactivity/window';
	import type { Table } from '@tanstack/table-core';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { m } from '$lib/paraglide/messages.js';
	import { BREAKPOINT } from '$lib/config';

	let { table }: { table: Table<TData> } = $props();

	const showEdgeButtons = $derived((innerWidth.current ?? BREAKPOINT.lg) >= BREAKPOINT.lg);
</script>

<div class="flex items-center justify-between px-2">
	<div class="text-muted-foreground flex-1 text-sm">
		{m.table_rows_selected({
			selected: String(table.getFilteredSelectedRowModel().rows.length),
			total: String(table.getFilteredRowModel().rows.length)
		})}
	</div>
	<div class="flex items-center space-x-6 lg:space-x-8">
		<div class="flex items-center space-x-2">
			<p class="text-sm font-medium">{m.table_rows_per_page()}</p>
			<Select.Root
				allowDeselect={false}
				type="single"
				value={`${table.getState().pagination.pageSize}`}
				onValueChange={(value) => {
					table.setPageSize(Number(value));
				}}
			>
				<Select.Trigger class="h-8 w-[70px]">
					{String(table.getState().pagination.pageSize)}
				</Select.Trigger>
				<Select.Content side="top">
					{#each [10, 20, 30, 40, 50] as pageSize (pageSize)}
						<Select.Item value={`${pageSize}`}>
							{pageSize}
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
		<div class="flex w-[100px] items-center justify-center text-sm font-medium">
			{m.table_page_of({
				current: String(table.getState().pagination.pageIndex + 1),
				total: String(table.getPageCount())
			})}
		</div>
		<div class="flex items-center space-x-2">
			{#if showEdgeButtons}
				<Button
					variant="outline"
					class="size-8 p-0"
					onclick={() => table.setPageIndex(0)}
					disabled={!table.getCanPreviousPage()}
				>
					<span class="sr-only">{m.table_sr_first_page()}</span>
					<ChevronsLeftIcon />
				</Button>
			{/if}
			<Button
				variant="outline"
				class="size-8 p-0"
				onclick={() => table.previousPage()}
				disabled={!table.getCanPreviousPage()}
			>
				<span class="sr-only">{m.table_sr_previous_page()}</span>
				<ChevronLeftIcon />
			</Button>
			<Button
				variant="outline"
				class="size-8 p-0"
				onclick={() => table.nextPage()}
				disabled={!table.getCanNextPage()}
			>
				<span class="sr-only">{m.table_sr_next_page()}</span>
				<ChevronRightIcon />
			</Button>
			{#if showEdgeButtons}
				<Button
					variant="outline"
					class="size-8 p-0"
					onclick={() => table.setPageIndex(Math.max(0, table.getPageCount() - 1))}
					disabled={!table.getCanNextPage()}
				>
					<span class="sr-only">{m.table_sr_last_page()}</span>
					<ChevronsRightIcon />
				</Button>
			{/if}
		</div>
	</div>
</div>
