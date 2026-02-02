<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import UserHoverCard from '$lib/components/shared/user-hover-card.svelte';
	import type { Sale } from '../data/dashboard';
	import { m } from '$lib/paraglide/messages.js';

	let {
		sales
	}: {
		sales: Sale[];
	} = $props();
</script>

<div class="space-y-8">
	{#each sales as sale (sale.email)}
		<div class="flex items-center gap-4">
			<Avatar.Root class="h-9 w-9">
				<Avatar.Image src={sale.avatar} alt={sale.name} />
				<Avatar.Fallback
					>{sale.name
						.split(' ')
						.map((n) => n[0])
						.join('')}</Avatar.Fallback
				>
			</Avatar.Root>
			<div class="flex flex-1 flex-wrap items-center justify-between">
				<UserHoverCard
					name={sale.name}
					email={sale.email}
					avatar={sale.avatar}
					detail={sale.amount}
					detailLabel={m.hover_sale_amount()}
				>
					<span class="space-y-1">
						<span class="block text-sm leading-none font-medium">{sale.name}</span>
						<span class="text-muted-foreground block text-sm">{sale.email}</span>
					</span>
				</UserHoverCard>
				<div class="font-medium">{sale.amount}</div>
			</div>
		</div>
	{/each}
</div>
