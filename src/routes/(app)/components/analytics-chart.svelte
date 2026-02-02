<script lang="ts">
	import * as Chart from '$lib/components/ui/chart/index.js';
	import { scalePoint } from 'd3-scale';
	import { curveNatural } from 'd3-shape';
	import { AreaChart } from 'layerchart';
	import { Tween, prefersReducedMotion } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { m } from '$lib/paraglide/messages.js';
	import type { AnalyticsPoint } from '../data/dashboard';

	let { data }: { data: AnalyticsPoint[] } = $props();

	const DURATION = 800;
	const reveal = new Tween(0, { duration: DURATION, easing: cubicOut });

	$effect(() => {
		reveal.set(1, {
			duration: prefersReducedMotion.current ? 0 : DURATION
		});
	});

	const clipInset = $derived(
		reveal.current >= 1 ? undefined : `inset(-1rem ${(1 - reveal.current) * 100}% 0 0)`
	);

	const chartConfig = {
		clicks: { label: m.dash_chart_clicks(), color: 'var(--chart-1)' },
		uniques: { label: m.dash_chart_unique_visitors(), color: 'var(--chart-2)' }
	} satisfies Chart.ChartConfig;
</script>

<div style:clip-path={clipInset}>
	<Chart.Container
		config={chartConfig}
		class="aspect-auto h-[300px] w-full pt-6"
		aria-label="Traffic analytics chart"
	>
		<AreaChart
			{data}
			x="name"
			xScale={scalePoint()}
			padding={{ top: 4, left: 40, bottom: 20, right: 4 }}
			series={[
				{
					key: 'clicks',
					label: chartConfig.clicks.label,
					color: chartConfig.clicks.color
				},
				{
					key: 'uniques',
					label: chartConfig.uniques.label,
					color: chartConfig.uniques.color
				}
			]}
			props={{
				area: {
					curve: curveNatural,
					'fill-opacity': 0.15,
					line: { class: 'stroke-1' }
				},
				yAxis: {
					ticks: [0, 200, 400, 600, 800, 1000]
				},
				grid: {
					yTicks: [0, 200, 400, 600, 800, 1000]
				}
			}}
		>
			{#snippet tooltip()}
				<Chart.Tooltip indicator="line" />
			{/snippet}
		</AreaChart>
	</Chart.Container>
</div>
