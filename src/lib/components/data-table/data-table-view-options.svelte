<script lang="ts" generics="TData">
	import Settings2Icon from '@lucide/svelte/icons/settings-2';
	import type { Table } from '@tanstack/table-core';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	import { m } from '$lib/paraglide/messages.js';

	let { table }: { table: Table<TData> } = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline" size="sm" class="ms-auto hidden h-8 lg:flex">
				<Settings2Icon class="size-4" />
				{m.table_view()}
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end" class="w-[150px]">
		<DropdownMenu.Label>{m.table_toggle_columns()}</DropdownMenu.Label>
		<DropdownMenu.Separator />
		{#each table
			.getAllColumns()
			.filter((col) => typeof col.accessorFn !== 'undefined' && col.getCanHide()) as column (column.id)}
			<DropdownMenu.CheckboxItem
				checked={column.getIsVisible()}
				onCheckedChange={(value) => column.toggleVisibility(!!value)}
				class="capitalize"
			>
				{column.columnDef.meta?.label ?? column.id}
			</DropdownMenu.CheckboxItem>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
