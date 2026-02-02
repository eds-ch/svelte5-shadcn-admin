<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<main class="bg-background container grid h-svh max-w-none items-center justify-center">
	{@render children()}
</main>
