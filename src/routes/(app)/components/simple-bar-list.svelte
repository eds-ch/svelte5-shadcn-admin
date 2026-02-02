<script lang="ts">
	import type { BarListItem } from '../data/dashboard';

	let {
		items,
		valueFormatter,
		barClass
	}: {
		items: BarListItem[];
		valueFormatter: (n: number) => string;
		barClass: string;
	} = $props();

	const max = $derived(Math.max(...items.map((i) => i.value), 1));
</script>

<ul class="space-y-3" aria-label="Bar list">
	{#each items as item (item.name)}
		{@const pct = Math.round((item.value / max) * 100)}
		{@const width = `${pct}%`}
		<li class="flex items-center justify-between gap-3">
			<div class="min-w-0 flex-1">
				<div class="text-muted-foreground mb-1 truncate text-xs">
					{item.name}
				</div>
				<div class="bg-muted h-2.5 w-full rounded-full">
					<div
						class={['h-2.5 rounded-full', barClass]}
						role="progressbar"
						aria-valuenow={item.value}
						aria-valuemin={0}
						aria-valuemax={max}
						style:width
					></div>
				</div>
			</div>
			<div class="ps-2 text-xs font-medium tabular-nums">
				{valueFormatter(item.value)}
			</div>
		</li>
	{/each}
</ul>
