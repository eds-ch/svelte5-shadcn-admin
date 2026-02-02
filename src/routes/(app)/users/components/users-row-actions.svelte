<script lang="ts">
	import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
	import UserPenIcon from '@lucide/svelte/icons/user-pen';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import type { Row } from '@tanstack/table-core';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { toast } from 'svelte-sonner';
	import { simulateServer } from '$lib/utils/simulate-server.js';
	import type { User, UserRole, UserStatus } from '../data/schema.js';
	import { getRoles, getUserStatuses } from '../data/data.js';
	import { getUsersContext } from '../context.js';
	import { m } from '$lib/paraglide/messages.js';
	import { tooltip } from '$lib/attachments/tooltip';

	const roles = getRoles();
	const userStatuses = getUserStatuses();

	let { row }: { row: Row<User> } = $props();

	const ctx = getUsersContext();
	const user = $derived(row.original);

	async function handleRoleChange(newRole: string | undefined) {
		if (!newRole) return;
		try {
			await ctx.apply(
				(users) =>
					users.map((u) =>
						u.id === user.id ? { ...u, role: newRole as UserRole, updatedAt: new Date() } : u
					),
				() => simulateServer(null)
			);
		} catch {
			toast.error(m.toast_action_failed());
		}
	}

	async function handleStatusChange(newStatus: string | undefined) {
		if (!newStatus) return;
		try {
			await ctx.apply(
				(users) =>
					users.map((u) =>
						u.id === user.id ? { ...u, status: newStatus as UserStatus, updatedAt: new Date() } : u
					),
				() => simulateServer(null)
			);
		} catch {
			toast.error(m.toast_action_failed());
		}
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				{@attach tooltip(m.common_open_menu())}
				variant="ghost"
				class="data-[state=open]:bg-muted flex size-8 p-0"
			>
				<EllipsisIcon class="size-4" />
				<span class="sr-only">{m.common_open_menu()}</span>
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end" class="w-[160px]">
		<DropdownMenu.Item onclick={() => ctx.openDialog('edit', user)}>
			{m.common_edit()}
			<DropdownMenu.Shortcut>
				<UserPenIcon class="size-4" />
			</DropdownMenu.Shortcut>
		</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Sub>
			<DropdownMenu.SubTrigger>{m.users_col_role()}</DropdownMenu.SubTrigger>
			<DropdownMenu.SubContent>
				<DropdownMenu.RadioGroup value={user.role} onValueChange={handleRoleChange}>
					{#each roles as role (role.value)}
						<DropdownMenu.RadioItem value={role.value}>
							{role.label}
						</DropdownMenu.RadioItem>
					{/each}
				</DropdownMenu.RadioGroup>
			</DropdownMenu.SubContent>
		</DropdownMenu.Sub>
		<DropdownMenu.Sub>
			<DropdownMenu.SubTrigger>{m.users_col_status()}</DropdownMenu.SubTrigger>
			<DropdownMenu.SubContent>
				<DropdownMenu.RadioGroup value={user.status} onValueChange={handleStatusChange}>
					{#each userStatuses as status (status.value)}
						<DropdownMenu.RadioItem value={status.value}>
							{status.label}
						</DropdownMenu.RadioItem>
					{/each}
				</DropdownMenu.RadioGroup>
			</DropdownMenu.SubContent>
		</DropdownMenu.Sub>
		<DropdownMenu.Separator />
		<DropdownMenu.Item onclick={() => ctx.openDialog('delete', user)} class="!text-destructive">
			{m.common_delete()}
			<DropdownMenu.Shortcut>
				<Trash2Icon class="size-4" />
			</DropdownMenu.Shortcut>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
