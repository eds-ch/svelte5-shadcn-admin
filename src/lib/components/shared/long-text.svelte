<script lang="ts">
	import { MediaQuery } from 'svelte/reactivity';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { cn } from '$lib/utils.js';

	let {
		text,
		class: className = '',
		contentClass = ''
	}: {
		text: string;
		class?: string;
		contentClass?: string;
	} = $props();

	let textRef: HTMLDivElement | undefined = $state();
	let isOverflowing = $state(false);

	const isDesktop = new MediaQuery('min-width: 640px', true);

	function checkOverflow(el: HTMLElement | undefined) {
		if (!el) return false;
		return el.offsetWidth < el.scrollWidth || el.offsetHeight < el.scrollHeight;
	}

	$effect(() => {
		void text; // track prop changes
		if (!textRef) return;
		isOverflowing = checkOverflow(textRef);

		const observer = new ResizeObserver(() => {
			isOverflowing = checkOverflow(textRef);
		});
		observer.observe(textRef);

		return () => observer.disconnect();
	});
</script>

{#if isDesktop.current}
	<Tooltip.Provider delayDuration={0}>
		<Tooltip.Root disabled={!isOverflowing}>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<div bind:this={textRef} class={cn('truncate', className)} {...props}>
						{text}
					</div>
				{/snippet}
			</Tooltip.Trigger>
			{#if isOverflowing}
				<Tooltip.Content>
					<p class={contentClass}>{text}</p>
				</Tooltip.Content>
			{/if}
		</Tooltip.Root>
	</Tooltip.Provider>
{:else}
	<Popover.Root>
		<Popover.Trigger>
			{#snippet child({ props })}
				<div bind:this={textRef} class={cn('truncate', className)} {...props}>
					{text}
				</div>
			{/snippet}
		</Popover.Trigger>
		{#if isOverflowing}
			<Popover.Content class={cn('w-fit', contentClass)}>
				<p>{text}</p>
			</Popover.Content>
		{/if}
	</Popover.Root>
{/if}
