<script lang="ts">
	import { getPriorities } from '../data/data.js';
	import { tooltip } from '$lib/attachments/tooltip';

	let { value }: { value: string } = $props();

	const priority = $derived(getPriorities().find((p) => p.value === value));
</script>

{#if priority}
	{@const Icon = priority.icon}
	<div class="flex items-center" {@attach tooltip(priority.label)}>
		<Icon class="text-muted-foreground me-2 size-4" />
		<span>{priority.label}</span>
	</div>
{/if}
