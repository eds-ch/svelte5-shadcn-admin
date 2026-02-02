<script lang="ts">
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
	import { m } from '$lib/paraglide/messages.js';

	let {
		error,
		reset,
		compact = false
	}: {
		error: unknown;
		reset: () => void;
		compact?: boolean;
	} = $props();

	const errorMessage = $derived(error instanceof Error ? error.message : String(error));
</script>

{#if compact}
	<div class="text-muted-foreground flex items-center gap-2 px-2 py-1.5 text-sm">
		<TriangleAlert class="text-destructive size-4 shrink-0" />
		<span class="truncate">{m.error_boundary_message()}</span>
		<Button variant="ghost" size="sm" class="ml-auto h-7 shrink-0 px-2 text-xs" onclick={reset}>
			{m.error_boundary_retry()}
		</Button>
	</div>
{:else}
	<Alert.Root variant="destructive">
		<TriangleAlert />
		<Alert.Title>{m.error_boundary_title()}</Alert.Title>
		<Alert.Description>
			<div class="flex items-center justify-between gap-4">
				<span>{errorMessage || m.error_boundary_message()}</span>
				<Button variant="outline" size="sm" class="shrink-0" onclick={reset}>
					{m.error_boundary_retry()}
				</Button>
			</div>
		</Alert.Description>
	</Alert.Root>
{/if}
