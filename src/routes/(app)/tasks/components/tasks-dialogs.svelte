<script lang="ts">
	import ConfirmDialog from '$lib/components/shared/confirm-dialog.svelte';
	import { toast } from 'svelte-sonner';
	import { simulateServer } from '$lib/utils/simulate-server.js';
	import { getTasksContext } from '../context.js';
	import { m } from '$lib/paraglide/messages.js';
	import TasksMutateDrawer from './tasks-mutate-drawer.svelte';
	import TasksImportDialog from './tasks-import-dialog.svelte';

	const ctx = getTasksContext();

	function handleOpenChange(value: boolean) {
		if (!value) {
			ctx.closeDialog();
		}
	}

	async function handleDeleteConfirm() {
		if (!ctx.currentRow) {
			ctx.closeDialog();
			return;
		}
		const deletedId = ctx.currentRow.id;
		ctx.closeDialog();
		try {
			await ctx.apply(
				(tasks) => tasks.filter((t) => t.id !== deletedId),
				() => simulateServer(null)
			);
			toast.success(m.tasks_toast_deleted({ id: deletedId }));
		} catch {
			toast.error(m.toast_action_failed());
		}
	}
</script>

<TasksMutateDrawer open={ctx.open === 'create'} onOpenChange={handleOpenChange} />

<TasksImportDialog open={ctx.open === 'import'} onOpenChange={handleOpenChange} />

{#if ctx.currentRow}
	<TasksMutateDrawer
		open={ctx.open === 'update'}
		onOpenChange={handleOpenChange}
		currentRow={ctx.currentRow}
	/>

	<ConfirmDialog
		open={ctx.open === 'delete'}
		title={m.tasks_delete_task_title({ id: ctx.currentRow.id })}
		desc={m.tasks_delete_task_desc({ id: ctx.currentRow.id })}
		confirmText={m.common_delete()}
		destructive
		onConfirm={handleDeleteConfirm}
	/>
{/if}
