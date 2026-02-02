import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import { Checkbox } from '$lib/components/ui/checkbox/index.js';
import DataTableColumnHeader from '$lib/components/data-table/data-table-column-header.svelte';
import LongText from '$lib/components/shared/long-text.svelte';
import type { User, UserRole, UserStatus } from '../data/schema.js';
import UsersUsernameCell from './users-username-cell.svelte';
import UsersStatusCell from './users-status-cell.svelte';
import UsersRoleCell from './users-role-cell.svelte';
import UsersRowActions from './users-row-actions.svelte';
import { m } from '$lib/paraglide/messages.js';

export function getUsersColumns(): ColumnDef<User>[] {
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
			accessorKey: 'username',
			header: ({ column }) =>
				renderComponent(DataTableColumnHeader, { column, title: m.users_col_username() }),
			cell: ({ row }) => renderComponent(UsersUsernameCell, { row }),
			enableHiding: false
		},
		{
			id: 'fullName',
			accessorFn: (row) => `${row.firstName} ${row.lastName}`,
			header: ({ column }) =>
				renderComponent(DataTableColumnHeader, { column, title: m.users_col_name() }),
			cell: ({ row }) =>
				renderComponent(LongText, {
					text: `${row.original.firstName} ${row.original.lastName}`,
					class: 'max-w-36'
				}),
			meta: { label: m.users_col_name(), className: 'w-36' }
		},
		{
			accessorKey: 'email',
			meta: { label: m.users_col_email() },
			header: ({ column }) =>
				renderComponent(DataTableColumnHeader, { column, title: m.users_col_email() }),
			cell: ({ row }) =>
				renderComponent(LongText, {
					text: row.getValue('email') as string,
					class: 'max-w-36'
				})
		},
		{
			accessorKey: 'phoneNumber',
			meta: { label: m.users_col_phone() },
			header: ({ column }) =>
				renderComponent(DataTableColumnHeader, { column, title: m.users_col_phone() }),
			enableSorting: false
		},
		{
			accessorKey: 'status',
			header: ({ column }) =>
				renderComponent(DataTableColumnHeader, { column, title: m.users_col_status() }),
			cell: ({ row }) =>
				renderComponent(UsersStatusCell, {
					status: row.getValue('status') as UserStatus
				}),
			filterFn: (row, id, value) => {
				return value.includes(row.getValue(id));
			},
			enableHiding: false,
			enableSorting: false
		},
		{
			accessorKey: 'role',
			header: ({ column }) =>
				renderComponent(DataTableColumnHeader, { column, title: m.users_col_role() }),
			cell: ({ row }) =>
				renderComponent(UsersRoleCell, {
					role: row.getValue('role') as UserRole
				}),
			filterFn: (row, id, value) => {
				return value.includes(row.getValue(id));
			},
			enableSorting: false,
			enableHiding: false
		},
		{
			id: 'actions',
			cell: ({ row }) => renderComponent(UsersRowActions, { row }),
			enableSorting: false,
			enableHiding: false
		}
	];
}
