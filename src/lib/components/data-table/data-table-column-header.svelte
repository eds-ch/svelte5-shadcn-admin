<script lang="ts">
	import ArrowDownIcon from '@lucide/svelte/icons/arrow-down';
	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import EyeOffIcon from '@lucide/svelte/icons/eye-off';
	import type { Column } from '@tanstack/table-core';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import { m } from '$lib/paraglide/messages.js';
	import { tooltip } from '$lib/attachments/tooltip';

	let {
		column,
		title,
		class: className
	}: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		column: Column<any, unknown>;
		title: string;
		class?: string;
	} = $props();
</script>

{#if !column.getCanSort()}
	<div class={cn(className)}>
		{title}
	</div>
{:else}
	<div class={cn('flex items-center space-x-2', className)}>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button
						{...props}
						{@attach tooltip(m.table_sort_tooltip())}
						variant="ghost"
						size="sm"
						class="data-[state=open]:bg-accent -ms-3 h-8"
					>
						<span>{title}</span>
						{#if column.getIsSorted() === 'desc'}
							<ArrowDownIcon class="ms-2 size-4" />
						{:else if column.getIsSorted() === 'asc'}
							<ArrowUpIcon class="ms-2 size-4" />
						{:else}
							<ChevronsUpDownIcon class="ms-2 size-4" />
						{/if}
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="start">
				<DropdownMenu.Item onclick={() => column.toggleSorting(false)}>
					<ArrowUpIcon class="text-muted-foreground/70 me-2 size-3.5" />
					{m.table_sort_asc()}
				</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => column.toggleSorting(true)}>
					<ArrowDownIcon class="text-muted-foreground/70 me-2 size-3.5" />
					{m.table_sort_desc()}
				</DropdownMenu.Item>
				{#if column.getCanHide()}
					<DropdownMenu.Separator />
					<DropdownMenu.Item onclick={() => column.toggleVisibility(false)}>
						<EyeOffIcon class="text-muted-foreground/70 me-2 size-3.5" />
						{m.table_hide_column()}
					</DropdownMenu.Item>
				{/if}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
{/if}
