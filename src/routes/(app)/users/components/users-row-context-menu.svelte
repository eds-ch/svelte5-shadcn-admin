<script lang="ts">
	import UserPenIcon from '@lucide/svelte/icons/user-pen';
	import MailPlusIcon from '@lucide/svelte/icons/mail-plus';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import type { Row } from '@tanstack/table-core';
	import * as ContextMenu from '$lib/components/ui/context-menu/index.js';
	import { toast } from 'svelte-sonner';
	import { simulateServer } from '$lib/utils/simulate-server.js';
	import type { User, UserRole, UserStatus } from '../data/schema.js';
	import { getRoles, getUserStatuses } from '../data/data.js';
	import { getUsersContext } from '../context.js';
	import { m } from '$lib/paraglide/messages.js';

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

<ContextMenu.Content class="w-[160px]">
	<ContextMenu.Item onclick={() => ctx.openDialog('edit', user)}>
		{m.common_edit()}
		<ContextMenu.Shortcut>
			<UserPenIcon class="size-4" />
		</ContextMenu.Shortcut>
	</ContextMenu.Item>
	<ContextMenu.Separator />
	<ContextMenu.Sub>
		<ContextMenu.SubTrigger>{m.users_col_role()}</ContextMenu.SubTrigger>
		<ContextMenu.SubContent>
			<ContextMenu.RadioGroup value={user.role} onValueChange={handleRoleChange}>
				{#each roles as role (role.value)}
					<ContextMenu.RadioItem value={role.value}>
						{role.label}
					</ContextMenu.RadioItem>
				{/each}
			</ContextMenu.RadioGroup>
		</ContextMenu.SubContent>
	</ContextMenu.Sub>
	<ContextMenu.Sub>
		<ContextMenu.SubTrigger>{m.users_col_status()}</ContextMenu.SubTrigger>
		<ContextMenu.SubContent>
			<ContextMenu.RadioGroup value={user.status} onValueChange={handleStatusChange}>
				{#each userStatuses as status (status.value)}
					<ContextMenu.RadioItem value={status.value}>
						{status.label}
					</ContextMenu.RadioItem>
				{/each}
			</ContextMenu.RadioGroup>
		</ContextMenu.SubContent>
	</ContextMenu.Sub>
	<ContextMenu.Separator />
	<ContextMenu.Item onclick={() => ctx.openDialog('invite')}>
		{m.users_invite_user()}
		<ContextMenu.Shortcut>
			<MailPlusIcon class="size-4" />
		</ContextMenu.Shortcut>
	</ContextMenu.Item>
	<ContextMenu.Separator />
	<ContextMenu.Item variant="destructive" onclick={() => ctx.openDialog('delete', user)}>
		{m.common_delete()}
		<ContextMenu.Shortcut>
			<Trash2Icon class="size-4" />
		</ContextMenu.Shortcut>
	</ContextMenu.Item>
</ContextMenu.Content>
