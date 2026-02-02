<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { toast } from 'svelte-sonner';
	import { m } from '$lib/paraglide/messages.js';

	let {
		open = $bindable(false),
		onOpenChange
	}: {
		open: boolean;
		onOpenChange: (open: boolean) => void;
	} = $props();

	let files: FileList | undefined = $state();
	let hasFile = $derived(!!(files && files.length > 0));

	function handleImport() {
		if (files && files.length > 0) {
			toast.success(m.tasks_toast_import_file({ name: files[0].name }));
		} else {
			toast.success(m.tasks_toast_import());
		}
		handleClose();
	}

	function handleClose() {
		onOpenChange(false);
		files = undefined;
	}
</script>

<Dialog.Root
	bind:open
	onOpenChange={(v) => {
		if (!v) handleClose();
	}}
>
	<Dialog.Content class="gap-2 sm:max-w-sm">
		<Dialog.Header class="text-start">
			<Dialog.Title>{m.tasks_import_title()}</Dialog.Title>
			<Dialog.Description>
				{m.tasks_import_desc()}
			</Dialog.Description>
		</Dialog.Header>
		<form
			id="task-import-form"
			onsubmit={(e) => {
				e.preventDefault();
				handleImport();
			}}
		>
			<div class="my-2 space-y-2">
				<Label for="task-import-file">{m.tasks_import_file_label()}</Label>
				<Input id="task-import-file" type="file" accept=".csv" class="h-8 py-0" bind:files />
			</div>
		</form>
		<Dialog.Footer class="gap-2">
			<Dialog.Close>
				{#snippet child({ props })}
					<Button {...props} variant="outline">{m.common_close()}</Button>
				{/snippet}
			</Dialog.Close>
			<Button type="submit" form="task-import-form" disabled={!hasFile}>
				{m.common_import()}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
