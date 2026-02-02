<script lang="ts">
	import { getRoles } from '../data/data.js';
	import type { UserRole } from '../data/schema.js';
	import { tooltip } from '$lib/attachments/tooltip';

	let { role }: { role: UserRole } = $props();

	const userRole = $derived(getRoles().find(({ value }) => value === role));
</script>

{#if userRole}
	<div class="flex items-center gap-x-2" {@attach tooltip(userRole.label)}>
		{#if userRole.icon}
			{@const Icon = userRole.icon}
			<Icon class="text-muted-foreground size-4" />
		{/if}
		<span class="text-sm">{userRole.label}</span>
	</div>
{/if}
