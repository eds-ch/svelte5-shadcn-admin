<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	let {
		fixed = false,
		children,
		class: className,
		...restProps
	}: HTMLAttributes<HTMLElement> & {
		fixed?: boolean;
		children: Snippet;
	} = $props();
</script>

<main
	id="content"
	data-layout={fixed ? 'fixed' : undefined}
	class={cn(
		'flex min-h-0 flex-1 flex-col p-4 md:p-6',
		fixed ? 'overflow-hidden' : 'overflow-y-auto',
		className
	)}
	{...restProps}
>
	{@render children()}
</main>
