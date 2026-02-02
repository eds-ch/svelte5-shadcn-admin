<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<main class="bg-background flex min-h-screen flex-col items-center justify-center gap-2">
	{@render children()}
</main>
