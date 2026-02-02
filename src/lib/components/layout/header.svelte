<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import { Separator } from '$lib/components/ui/separator';
	import { SidebarTrigger } from '$lib/components/ui/sidebar';

	let {
		fixed = false,
		class: className,
		children
	}: {
		fixed?: boolean;
		class?: string;
		children: Snippet;
	} = $props();

	let offset = $state(0);
</script>

<svelte:window bind:scrollY={offset} />

<header
	class={cn(
		'z-50 h-16',
		fixed && 'header-fixed peer/header sticky top-0 w-[inherit]',
		offset > 10 && fixed ? 'shadow' : 'shadow-none',
		className
	)}
	data-layout={fixed ? 'fixed' : undefined}
>
	<div
		class={cn(
			'relative flex h-full items-center gap-3 p-4 sm:gap-4',
			offset > 10 &&
				fixed &&
				'after:bg-background/20 after:absolute after:inset-0 after:-z-10 after:backdrop-blur-lg'
		)}
	>
		<SidebarTrigger variant="outline" class="max-md:scale-125" />
		<Separator orientation="vertical" class="h-6" />
		{@render children()}
	</div>
</header>
