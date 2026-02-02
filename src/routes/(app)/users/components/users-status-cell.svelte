<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { cn } from '$lib/utils.js';
	import { statusBadgeStyles, getUserStatuses } from '../data/data.js';
	import type { UserStatus } from '../data/schema.js';
	import { tooltip } from '$lib/attachments/tooltip';

	let { status }: { status: UserStatus } = $props();

	const userStatus = $derived(getUserStatuses().find(({ value }) => value === status));
</script>

<div class="flex space-x-2" {@attach tooltip(userStatus?.label ?? status)}>
	<Badge variant="outline" class={cn(statusBadgeStyles.get(status))}>
		{userStatus?.label ?? status}
	</Badge>
</div>
