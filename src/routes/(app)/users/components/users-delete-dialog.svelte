<script lang="ts">
	import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { toast } from 'svelte-sonner';
	import { simulateServer } from '$lib/utils/simulate-server.js';
	import type { User } from '../data/schema.js';
	import { getUsersContext } from '../context.js';
	import { m } from '$lib/paraglide/messages.js';

	let {
		open = $bindable(false),
		onOpenChange,
		currentRow
	}: {
		open: boolean;
		onOpenChange: (open: boolean) => void;
		currentRow: User;
	} = $props();

	const ctx = getUsersContext();
	let confirmValue = $state('');

	const isConfirmDisabled = $derived(confirmValue.trim() !== currentRow.username);

	async function handleDelete() {
		if (isConfirmDisabled) return;

		const deletedId = currentRow.id;
		const username = currentRow.username;
		onOpenChange(false);
		confirmValue = '';
		try {
			await ctx.apply(
				(users) => users.filter((u) => u.id !== deletedId),
				() => simulateServer(null)
			);
			toast.success(m.users_toast_deleted({ username }));
		} catch {
			toast.error(m.toast_action_failed());
		}
	}

	function handleOpenChange(state: boolean) {
		if (!state) {
			confirmValue = '';
		}
		onOpenChange(state);
	}
</script>

<AlertDialog.Root {open} onOpenChange={handleOpenChange}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title class="text-destructive flex items-center gap-1">
				<TriangleAlertIcon class="stroke-destructive inline-block size-[18px]" />
				{m.users_delete_title()}
			</AlertDialog.Title>
			<AlertDialog.Description>
				{m.users_delete_confirm()}
			</AlertDialog.Description>
		</AlertDialog.Header>

		<div class="space-y-4">
			<p class="text-muted-foreground text-sm">
				{m.users_delete_confirm_detail({ username: currentRow.username, role: currentRow.role })}
			</p>

			<Label class="flex flex-col items-start gap-1.5">
				<span>{m.users_delete_username_label()}</span>
				<Input bind:value={confirmValue} placeholder={m.users_delete_username_placeholder()} />
			</Label>

			<Alert.Root variant="destructive">
				<TriangleAlertIcon class="size-4" />
				<Alert.Title>{m.common_warning()}</Alert.Title>
				<Alert.Description>
					{m.common_warning_desc()}
				</Alert.Description>
			</Alert.Root>
		</div>

		<AlertDialog.Footer>
			<AlertDialog.Cancel>{m.common_cancel()}</AlertDialog.Cancel>
			<Button variant="destructive" onclick={handleDelete} disabled={isConfirmDisabled}>
				{m.common_delete()}
			</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
