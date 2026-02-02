<script lang="ts">
	import { Tween, prefersReducedMotion } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import type { MetricValueFormat } from '../data/dashboard';

	let {
		value,
		format,
		locale
	}: {
		value: number;
		format: MetricValueFormat;
		locale: string;
	} = $props();

	const DURATION = 800;

	const tween = new Tween(0, { duration: DURATION, easing: cubicOut });

	$effect(() => {
		tween.set(value, {
			duration: prefersReducedMotion.current ? 0 : DURATION
		});
	});

	function formatValue(n: number): string {
		switch (format) {
			case 'currency':
				return (
					'$' +
					n.toLocaleString(locale, {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					})
				);
			case 'number':
				return Math.round(n).toLocaleString(locale);
			case 'number-plus':
				return '+' + Math.round(n).toLocaleString(locale);
			case 'percent':
				return Math.round(n) + '%';
			case 'duration': {
				const totalSec = Math.round(n);
				const min = Math.floor(totalSec / 60);
				const sec = totalSec % 60;
				return `${min}m ${sec}s`;
			}
		}
	}

	const display = $derived(formatValue(tween.current));
</script>

<span>{display}</span>
