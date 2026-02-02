<script lang="ts">
	import { navigating } from '$app/state';
	import { m } from '$lib/paraglide/messages.js';
</script>

{#if navigating.from}
	<div
		class="bg-primary fixed top-0 right-0 left-0 z-[9999] h-0.5 animate-pulse"
		role="progressbar"
		aria-valuemin={0}
		aria-valuemax={100}
		aria-label={m.common_page_loading()}
	></div>
{/if}
