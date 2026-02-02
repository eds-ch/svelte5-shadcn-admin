<script lang="ts">
	import { getStatuses } from '../data/data.js';
	import { tooltip } from '$lib/attachments/tooltip';

	let { value }: { value: string } = $props();

	const status = $derived(getStatuses().find((s) => s.value === value));
</script>

{#if status}
	{@const Icon = status.icon}
	<div class="flex w-[100px] items-center" {@attach tooltip(status.label)}>
		<Icon class="text-muted-foreground me-2 size-4" />
		<span>{status.label}</span>
	</div>
{/if}
