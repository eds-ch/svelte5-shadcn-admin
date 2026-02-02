import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import DataTableColumnHeader from '$lib/components/data-table/data-table-column-header.svelte';
import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
import type { Task } from '../data/schema.js';
import TasksIdCell from './tasks-id-cell.svelte';
import TasksTitleCell from './tasks-title-cell.svelte';
import TasksStatusCell from './tasks-status-cell.svelte';
import TasksPriorityCell from './tasks-priority-cell.svelte';
import TasksRowActions from './tasks-row-actions.svelte';
import { m } from '$lib/paraglide/messages.js';

export function getColumns(): ColumnDef<Task>[] {
	return [
		{
			id: 'select',
			header: ({ table }) =>
				renderComponent(Checkbox, {
					checked: table.getIsAllPageRowsSelected(),
					indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
					onCheckedChange: (value: boolean) => table.toggleAllPageRowsSelected(!!value),
					'aria-label': m.table_select_all(),
					class: 'translate-y-[2px]'
				}),
			cell: ({ row }) =>
				renderComponent(Checkbox, {
					checked: row.getIsSelected(),
					onCheckedChange: (value: boolean) => row.toggleSelected(!!value),
					'aria-label': m.table_select_row(),
					class: 'translate-y-[2px]'
				}),
			enableSorting: false,
			enableHiding: false
		},
		{
			accessorKey: 'id',
			header: ({ column }) =>
				renderComponent(DataTableColumnHeader, {
					column,
					title: m.tasks_col_task()
				}),
			cell: ({ row }) =>
				renderComponent(TasksIdCell, {
					id: row.getValue('id') as string
				}),
			enableSorting: false,
			enableHiding: false
		},
		{
			accessorKey: 'title',
			meta: { label: m.tasks_col_title() },
			header: ({ column }) =>
				renderComponent(DataTableColumnHeader, {
					column,
					title: m.tasks_col_title()
				}),
			cell: ({ row }) =>
				renderComponent(TasksTitleCell, {
					labelValue: row.original.label,
					title: row.getValue('title') as string
				})
		},
		{
			accessorKey: 'status',
			meta: { label: m.tasks_col_status() },
			header: ({ column }) =>
				renderComponent(DataTableColumnHeader, {
					column,
					title: m.tasks_col_status()
				}),
			cell: ({ row }) =>
				renderComponent(TasksStatusCell, {
					value: row.getValue('status') as string
				}),
			filterFn: (row, id, value) => {
				return value.includes(row.getValue(id));
			}
		},
		{
			accessorKey: 'priority',
			meta: { label: m.tasks_col_priority() },
			header: ({ column }) =>
				renderComponent(DataTableColumnHeader, {
					column,
					title: m.tasks_col_priority()
				}),
			cell: ({ row }) =>
				renderComponent(TasksPriorityCell, {
					value: row.getValue('priority') as string
				}),
			filterFn: (row, id, value) => {
				return value.includes(row.getValue(id));
			}
		},
		{
			id: 'actions',
			cell: ({ row }) => renderComponent(TasksRowActions, { row })
		}
	];
}
