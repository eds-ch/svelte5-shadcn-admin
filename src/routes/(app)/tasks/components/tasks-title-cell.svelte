<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { getLabels } from '../data/data.js';

	let { labelValue, title }: { labelValue: string; title: string } = $props();

	const label = $derived(getLabels().find((l) => l.value === labelValue));
</script>

<div class="flex space-x-2">
	{#if label}
		<Badge variant="outline">{label.label}</Badge>
	{/if}
	<span class="max-w-[31.25rem] font-medium max-sm:line-clamp-2 sm:truncate">
		{title}
	</span>
</div>
