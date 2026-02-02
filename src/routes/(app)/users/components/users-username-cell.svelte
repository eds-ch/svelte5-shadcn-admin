<script lang="ts">
	import type { Row } from '@tanstack/table-core';
	import type { User } from '../data/schema.js';
	import { getRoles, getUserStatuses } from '../data/data.js';
	import { getAvatarUrl } from '$lib/utils/avatar.js';
	import UserHoverCard from '$lib/components/shared/user-hover-card.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime.js';

	let { row }: { row: Row<User> } = $props();

	const user = $derived(row.original);
	const roleLabel = $derived(getRoles().find((r) => r.value === user.role)?.label ?? user.role);
	const statusLabel = $derived(
		getUserStatuses().find((s) => s.value === user.status)?.label ?? user.status
	);
	const createdLabel = $derived(
		user.createdAt.toLocaleDateString(getLocale(), {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		})
	);
</script>

<UserHoverCard
	name="{user.firstName} {user.lastName}"
	email={user.email}
	avatar={getAvatarUrl(user.username)}
	role={roleLabel}
	status={statusLabel}
	detail={createdLabel}
	detailLabel={m.hover_created()}
>
	<span class="max-w-36 truncate">{user.username}</span>
</UserHoverCard>
