<script lang="ts">
	import { scrollY } from 'svelte/reactivity/window';
	import ArrowUp from '@lucide/svelte/icons/arrow-up';
	import { m } from '$lib/paraglide/messages.js';
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';

	const threshold = 300;

	let containerScrollTop = $state(0);
	let scrollElement: HTMLElement | null = null;

	// Check both #content scroll (app pages) and window scroll (error/auth pages)
	const visible = $derived(containerScrollTop > threshold || (scrollY.current ?? 0) > threshold);

	$effect(() => {
		scrollElement = document.getElementById('content');
		if (!scrollElement) return;

		function handleScroll() {
			containerScrollTop = scrollElement!.scrollTop;
		}

		scrollElement.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();

		return () => {
			scrollElement?.removeEventListener('scroll', handleScroll);
		};
	});

	function handleClick() {
		if (scrollElement && containerScrollTop > 0) {
			scrollElement.scrollTo({ top: 0, behavior: 'smooth' });
		} else {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}
</script>

{#if visible}
	<Button
		onclick={handleClick}
		aria-label={m.common_scroll_to_top()}
		variant="secondary"
		size="icon"
		class={cn(
			'fixed right-8 bottom-8 z-50 rounded-full shadow-lg',
			'transition-opacity duration-200'
		)}
	>
		<ArrowUp class="size-5" />
	</Button>
{/if}
