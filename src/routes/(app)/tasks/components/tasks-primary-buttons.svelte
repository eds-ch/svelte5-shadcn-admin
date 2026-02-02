<script lang="ts">
	import DownloadIcon from '@lucide/svelte/icons/download';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import { Button } from '$lib/components/ui/button/index.js';
	import { getTasksContext } from '../context.js';
	import { m } from '$lib/paraglide/messages.js';

	const ctx = getTasksContext();
</script>

<div class="flex gap-2">
	<Button
		variant="outline"
		class="space-x-1"
		onclick={() => {
			ctx.openDialog('import');
		}}
	>
		<span>{m.common_import()}</span>
		<DownloadIcon class="size-4" />
	</Button>
	<Button
		class="space-x-1"
		onclick={() => {
			ctx.openDialog('create');
		}}
	>
		<span>{m.common_create()}</span>
		<PlusIcon class="size-4" />
	</Button>
</div>
