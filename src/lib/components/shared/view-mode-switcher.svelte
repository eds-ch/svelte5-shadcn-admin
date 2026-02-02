<script lang="ts">
	import type { Component } from 'svelte';
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';
	import { tooltip } from '$lib/attachments/tooltip';

	interface ViewMode {
		value: string;
		icon: Component;
		label: string;
	}

	let {
		modes,
		value = $bindable(),
		onchange
	}: {
		modes: ViewMode[];
		value: string;
		onchange?: (value: string) => void;
	} = $props();

	function handleChange(newValue: string | undefined) {
		if (newValue && newValue !== value) {
			value = newValue;
			onchange?.(newValue);
		}
	}
</script>

<ToggleGroup.Root type="single" variant="outline" size="sm" {value} onValueChange={handleChange}>
	{#each modes as mode (mode.value)}
		<ToggleGroup.Item value={mode.value} {@attach tooltip(mode.label, { side: 'bottom' })}>
			<mode.icon class="size-4" />
			<span class="sr-only">{mode.label}</span>
		</ToggleGroup.Item>
	{/each}
</ToggleGroup.Root>
