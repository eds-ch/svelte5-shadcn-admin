<script lang="ts">
	import {
		type ColumnFiltersState,
		type PaginationState,
		type RowSelectionState,
		type SortingState,
		type VisibilityState,
		getCoreRowModel,
		getFacetedRowModel,
		getFacetedUniqueValues,
		getFilteredRowModel,
		getPaginationRowModel,
		getSortedRowModel
	} from '@tanstack/table-core';
	import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import DataTableToolbar from '$lib/components/data-table/data-table-toolbar.svelte';
	import DataTablePagination from '$lib/components/data-table/data-table-pagination.svelte';
	import DataTableFacetedFilter from '$lib/components/data-table/data-table-faceted-filter.svelte';
	import DataTableViewOptions from '$lib/components/data-table/data-table-view-options.svelte';
	import ConfirmDialog from '$lib/components/shared/confirm-dialog.svelte';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import AlertTriangleIcon from '@lucide/svelte/icons/triangle-alert';
	import { SvelteSet } from 'svelte/reactivity';
	import { innerWidth } from 'svelte/reactivity/window';
	import { BREAKPOINT } from '$lib/config';
	import { toast } from 'svelte-sonner';
	import { simulateServer } from '$lib/utils/simulate-server.js';
	import { createFilterSync } from '$lib/hooks/url-filter-sync.svelte.js';
	import { getStatuses, getPriorities } from '../data/data.js';
	import type { Task } from '../data/schema.js';
	import { getColumns } from './tasks-columns.js';
	import { getTasksContext } from '../context.js';
	import { getShortcuts } from '$lib/contexts/shortcuts.svelte.js';
	import { m } from '$lib/paraglide/messages.js';
	import * as ContextMenu from '$lib/components/ui/context-menu/index.js';
	import TasksRowContextMenu from './tasks-row-context-menu.svelte';
	import ErrorFallback from '$lib/components/shared/error-fallback.svelte';

	const columns = getColumns();
	const statuses = getStatuses();
	const priorities = getPriorities();

	let {
		data,
		initialSearch = '',
		initialStatus = [] as string[],
		initialPriority = [] as string[],
		initialSort = [] as SortingState,
		initialPage = 0,
		initialPageSize = 10
	}: {
		data: Task[];
		initialSearch?: string;
		initialStatus?: string[];
		initialPriority?: string[];
		initialSort?: SortingState;
		initialPage?: number;
		initialPageSize?: number;
	} = $props();

	const urlSync = createFilterSync();

	// svelte-ignore state_referenced_locally
	let sorting = $state<SortingState>(initialSort);
	// svelte-ignore state_referenced_locally
	let columnFilters = $state<ColumnFiltersState>([
		...(initialSearch ? [{ id: 'title', value: initialSearch }] : []),
		...(initialStatus.length ? [{ id: 'status', value: initialStatus }] : []),
		...(initialPriority.length ? [{ id: 'priority', value: initialPriority }] : [])
	]);
	let columnVisibility = $state<VisibilityState>({});
	const responsiveHidden = $derived.by((): VisibilityState => {
		const w = innerWidth.current ?? BREAKPOINT.lg;
		if (w < BREAKPOINT.sm) return { id: false, status: false, priority: false };
		if (w < BREAKPOINT.md) return { status: false, priority: false };
		return {};
	});
	let rowSelection = $state<RowSelectionState>({});
	// svelte-ignore state_referenced_locally
	let pagination = $state<PaginationState>({ pageIndex: initialPage, pageSize: initialPageSize });

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
		state: {
			get sorting() {
				return sorting;
			},
			get columnFilters() {
				return columnFilters;
			},
			get columnVisibility() {
				return { ...responsiveHidden, ...columnVisibility };
			},
			get rowSelection() {
				return rowSelection;
			},
			get pagination() {
				return pagination;
			}
		},
		enableRowSelection: true,
		onSortingChange: (updater) => {
			const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
			sorting = newSorting;
			urlSync.update({
				sort:
					newSorting.length > 0
						? `${newSorting[0].id}.${newSorting[0].desc ? 'desc' : 'asc'}`
						: null
			});
		},
		onColumnFiltersChange: (updater) => {
			const newFilters = typeof updater === 'function' ? updater(columnFilters) : updater;
			columnFilters = newFilters;
			focusedRowIndex = null;
			const search = (newFilters.find((f) => f.id === 'title')?.value as string) ?? '';
			const status = (newFilters.find((f) => f.id === 'status')?.value as string[]) ?? [];
			const priority = (newFilters.find((f) => f.id === 'priority')?.value as string[]) ?? [];
			urlSync.update({
				search: search || null,
				status: status.length > 0 ? status.join(',') : null,
				priority: priority.length > 0 ? priority.join(',') : null,
				page: null
			});
		},
		onColumnVisibilityChange: (updater) => {
			if (typeof updater === 'function') {
				columnVisibility = updater(columnVisibility);
			} else {
				columnVisibility = updater;
			}
		},
		onRowSelectionChange: (updater) => {
			if (typeof updater === 'function') {
				rowSelection = updater(rowSelection);
			} else {
				rowSelection = updater;
			}
		},
		onPaginationChange: (updater) => {
			const newPagination = typeof updater === 'function' ? updater(pagination) : updater;
			pagination = newPagination;
			focusedRowIndex = null;
			urlSync.update({
				page: newPagination.pageIndex > 0 ? String(newPagination.pageIndex + 1) : null,
				per_page: newPagination.pageSize !== 10 ? String(newPagination.pageSize) : null
			});
		},
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues()
	});

	const ctx = getTasksContext();

	const titleFilterValue = $derived((table.getColumn('title')?.getFilterValue() as string) ?? '');

	const selectedTaskIds = $derived(
		new SvelteSet(table.getFilteredSelectedRowModel().rows.map((row) => (row.original as Task).id))
	);

	let focusedRowIndex = $state<number | null>(null);
	let searchInputRef = $state<HTMLInputElement | null>(null);
	let bulkDeleteOpen = $state(false);

	async function handleBulkDelete() {
		const idsToDelete = new Set(selectedTaskIds);
		const count = idsToDelete.size;
		table.resetRowSelection();
		bulkDeleteOpen = false;
		try {
			await ctx.apply(
				(tasks) => tasks.filter((t) => !idsToDelete.has(t.id)),
				() => simulateServer(null)
			);
			toast.success(m.tasks_toast_bulk_deleted({ count: String(count) }));
		} catch {
			toast.error(m.toast_action_failed());
		}
	}

	// Keyboard shortcuts
	const shortcutRegistry = getShortcuts();
	const visibleRows = $derived(table.getRowModel().rows);

	$effect(() => {
		if (focusedRowIndex !== null && focusedRowIndex >= visibleRows.length) {
			focusedRowIndex = visibleRows.length > 0 ? visibleRows.length - 1 : null;
		}
	});

	$effect(() => {
		if (focusedRowIndex !== null) {
			document.querySelector('[data-focused=true]')?.scrollIntoView({ block: 'nearest' });
		}
	});

	$effect(() => {
		return shortcutRegistry.register([
			{
				key: '/',
				label: m.shortcut_search(),
				action: () => searchInputRef?.focus(),
				scope: 'tasks'
			},
			{
				key: 'e',
				label: m.shortcut_edit(),
				action: () => {
					if (focusedRowIndex !== null && visibleRows[focusedRowIndex]) {
						ctx.openDialog('update', visibleRows[focusedRowIndex].original);
					}
				},
				scope: 'tasks',
				enabled: () => focusedRowIndex !== null && ctx.open === null
			},
			{
				key: 'Delete',
				label: m.shortcut_delete_row(),
				action: () => {
					if (selectedTaskIds.size > 0) {
						bulkDeleteOpen = true;
					} else if (focusedRowIndex !== null && visibleRows[focusedRowIndex]) {
						ctx.openDialog('delete', visibleRows[focusedRowIndex].original);
					}
				},
				scope: 'tasks',
				enabled: () => (focusedRowIndex !== null || selectedTaskIds.size > 0) && ctx.open === null
			},
			{
				key: 'Escape',
				label: m.shortcut_clear_selection(),
				action: () => {
					if (titleFilterValue) {
						table.getColumn('title')?.setFilterValue('');
					} else if (focusedRowIndex !== null) {
						focusedRowIndex = null;
					} else if (Object.keys(rowSelection).length > 0) {
						table.resetRowSelection();
					}
				},
				scope: 'tasks',
				enabled: () => ctx.open === null
			},
			{
				key: 'ArrowDown',
				label: m.shortcut_navigate_rows(),
				action: () => {
					if (focusedRowIndex === null) {
						focusedRowIndex = 0;
					} else {
						focusedRowIndex = Math.min(focusedRowIndex + 1, visibleRows.length - 1);
					}
				},
				scope: 'tasks',
				enabled: () => ctx.open === null
			},
			{
				key: 'ArrowUp',
				label: m.shortcut_navigate_rows(),
				action: () => {
					if (focusedRowIndex === null) {
						focusedRowIndex = visibleRows.length - 1;
					} else {
						focusedRowIndex = Math.max(focusedRowIndex - 1, 0);
					}
				},
				scope: 'tasks',
				enabled: () => ctx.open === null
			}
		]);
	});
</script>

<div class="flex flex-1 flex-col gap-4">
	<svelte:boundary onerror={(e) => console.error('[TasksToolbar]', e)}>
		<DataTableToolbar {table}>
			<Input
				bind:ref={searchInputRef}
				placeholder={m.tasks_filter_placeholder()}
				value={titleFilterValue}
				oninput={(e) => {
					table.getColumn('title')?.setFilterValue(e.currentTarget.value);
				}}
				class="h-8 w-[150px] lg:w-[250px]"
			/>
			{@const statusColumn = table.getColumn('status')}
			{@const priorityColumn = table.getColumn('priority')}
			{#if statusColumn}
				<DataTableFacetedFilter
					column={statusColumn}
					title={m.tasks_col_status()}
					options={statuses}
				/>
			{/if}
			{#if priorityColumn}
				<DataTableFacetedFilter
					column={priorityColumn}
					title={m.tasks_col_priority()}
					options={priorities}
				/>
			{/if}
			{#snippet actions()}
				<DataTableViewOptions {table} />
			{/snippet}
		</DataTableToolbar>
		{#snippet failed(error, reset)}
			<ErrorFallback {error} {reset} />
		{/snippet}
	</svelte:boundary>

	<svelte:boundary onerror={(e) => console.error('[TasksDataTable]', e)}>
		<div class="rounded-md border">
			<Table.Root>
				<Table.Header>
					{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
						<Table.Row>
							{#each headerGroup.headers as header (header.id)}
								<Table.Head colspan={header.colSpan}>
									{#if !header.isPlaceholder}
										<FlexRender
											content={header.column.columnDef.header}
											context={header.getContext()}
										/>
									{/if}
								</Table.Head>
							{/each}
						</Table.Row>
					{/each}
				</Table.Header>
				<Table.Body>
					{#each table.getRowModel().rows as row, rowIndex (row.id)}
						<ContextMenu.Root>
							<ContextMenu.Trigger>
								{#snippet child({ props })}
									<Table.Row
										{...props}
										data-state={row.getIsSelected() && 'selected'}
										data-focused={focusedRowIndex === rowIndex ? true : undefined}
										class="data-[focused=true]:bg-muted/50 data-[focused=true]:ring-ring data-[focused=true]:ring-1 data-[focused=true]:ring-inset"
									>
										{#each row.getVisibleCells() as cell (cell.id)}
											<Table.Cell>
												<FlexRender
													content={cell.column.columnDef.cell}
													context={cell.getContext()}
												/>
											</Table.Cell>
										{/each}
									</Table.Row>
								{/snippet}
							</ContextMenu.Trigger>
							<TasksRowContextMenu {row} />
						</ContextMenu.Root>
					{:else}
						<Table.Row>
							<Table.Cell colspan={columns.length} class="h-24 text-center">
								{m.common_no_results()}
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>

		<DataTablePagination {table} />
		{#snippet failed(error, reset)}
			<ErrorFallback {error} {reset} />
		{/snippet}
	</svelte:boundary>

	{#if selectedTaskIds.size > 0}
		<div
			class="bg-background fixed inset-x-0 bottom-4 z-50 mx-auto w-fit rounded-md border px-4 py-2 shadow-sm"
		>
			<div class="flex items-center gap-3">
				<span class="text-muted-foreground text-sm">
					{m.tasks_n_tasks_selected({ count: String(selectedTaskIds.size) })}
				</span>
				<Button
					variant="destructive"
					size="sm"
					onclick={() => {
						bulkDeleteOpen = true;
					}}
				>
					<Trash2Icon class="mr-1.5 size-4" />
					{m.tasks_delete_selected()}
				</Button>
			</div>
		</div>
	{/if}
</div>

<ConfirmDialog
	bind:open={bulkDeleteOpen}
	title={m.tasks_bulk_delete_title({ count: String(selectedTaskIds.size) })}
	desc={m.tasks_bulk_delete_desc()}
	confirmText={m.common_delete()}
	destructive
	onConfirm={handleBulkDelete}
>
	<div class="my-4">
		<Alert.Root variant="destructive">
			<AlertTriangleIcon class="size-4" />
			<Alert.Title>{m.common_warning()}</Alert.Title>
			<Alert.Description>
				{m.common_warning_desc()}
			</Alert.Description>
		</Alert.Root>
	</div>
</ConfirmDialog>
