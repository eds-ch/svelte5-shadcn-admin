<script lang="ts">
	import { getUsersContext } from '../context.js';
	import UsersActionDialog from './users-action-dialog.svelte';
	import UsersInviteDialog from './users-invite-dialog.svelte';
	import UsersDeleteDialog from './users-delete-dialog.svelte';

	const ctx = getUsersContext();

	function handleOpenChange(open: boolean) {
		if (!open) {
			ctx.closeDialog();
		}
	}
</script>

<UsersActionDialog open={ctx.open === 'add'} onOpenChange={handleOpenChange} />
<UsersInviteDialog open={ctx.open === 'invite'} onOpenChange={handleOpenChange} />

{#if ctx.currentRow}
	<UsersActionDialog
		open={ctx.open === 'edit'}
		onOpenChange={handleOpenChange}
		currentRow={ctx.currentRow}
	/>

	<UsersDeleteDialog
		open={ctx.open === 'delete'}
		onOpenChange={handleOpenChange}
		currentRow={ctx.currentRow}
	/>
{/if}
