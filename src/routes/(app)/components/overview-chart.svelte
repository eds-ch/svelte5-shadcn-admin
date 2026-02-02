<script lang="ts">
	import * as Chart from '$lib/components/ui/chart/index.js';
	import { scaleBand } from 'd3-scale';
	import { cubicInOut } from 'svelte/easing';
	import { BarChart, type ChartContextValue } from 'layerchart';
	import { m } from '$lib/paraglide/messages.js';
	import type { ChartPoint } from '../data/dashboard';

	let { data }: { data: ChartPoint[] } = $props();

	let context = $state<ChartContextValue>();

	const chartConfig = {
		total: {
			label: m.dash_chart_revenue(),
			color: 'var(--primary)'
		}
	} satisfies Chart.ChartConfig;
</script>

<Chart.Container config={chartConfig} class="aspect-auto h-[350px] w-full">
	<BarChart
		bind:context
		{data}
		x="name"
		xScale={scaleBand().padding(0.25)}
		padding={{ top: 4, left: 48, bottom: 20, right: 4 }}
		series={[
			{
				key: 'total',
				label: chartConfig.total.label,
				color: chartConfig.total.color
			}
		]}
		tooltip={false}
		props={{
			bars: {
				stroke: 'none',
				rounded: 'all',
				initialY: context?.height,
				initialHeight: 0,
				motion: {
					y: { type: 'tween', duration: 500, easing: cubicInOut },
					height: { type: 'tween', duration: 500, easing: cubicInOut }
				}
			},
			yAxis: {
				ticks: [0, 2000, 4000, 6000, 8000],
				format: (d: number) => `$${d}`
			},
			grid: {
				yTicks: [0, 2000, 4000, 6000, 8000]
			}
		}}
	/>
</Chart.Container>
