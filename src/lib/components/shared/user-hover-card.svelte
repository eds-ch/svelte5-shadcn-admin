<script lang="ts">
	import type { Snippet } from 'svelte';
	import * as HoverCard from '$lib/components/ui/hover-card/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';

	let {
		name,
		email,
		avatar,
		role,
		status,
		detail,
		detailLabel,
		children
	}: {
		name: string;
		email?: string;
		avatar?: string;
		role?: string;
		status?: string;
		detail?: string;
		detailLabel?: string;
		children: Snippet;
	} = $props();

	const initials = $derived(
		name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2)
	);
</script>

<HoverCard.Root openDelay={300}>
	<HoverCard.Trigger>
		{#snippet child({ props })}
			<span {...props}>
				{@render children()}
			</span>
		{/snippet}
	</HoverCard.Trigger>
	<HoverCard.Content class="w-64">
		<div class="flex gap-3">
			<Avatar.Root class="size-10">
				{#if avatar}
					<Avatar.Image src={avatar} alt={name} />
				{/if}
				<Avatar.Fallback>{initials}</Avatar.Fallback>
			</Avatar.Root>
			<div class="min-w-0 flex-1 space-y-1">
				<h4 class="text-sm font-semibold">{name}</h4>
				{#if email}
					<p class="text-muted-foreground truncate text-xs">{email}</p>
				{/if}
				{#if role || status}
					<div class="flex flex-wrap gap-1">
						{#if role}
							<Badge variant="outline" class="text-xs">{role}</Badge>
						{/if}
						{#if status}
							<Badge variant="secondary" class="text-xs">{status}</Badge>
						{/if}
					</div>
				{/if}
				{#if detail && detailLabel}
					<p class="text-muted-foreground pt-1 text-xs">
						{detailLabel}: <span class="text-foreground font-medium">{detail}</span>
					</p>
				{/if}
			</div>
		</div>
	</HoverCard.Content>
</HoverCard.Root>
