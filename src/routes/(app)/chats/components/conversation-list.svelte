<script lang="ts">
	import Search from '@lucide/svelte/icons/search';
	import MessagesSquare from '@lucide/svelte/icons/messages-square';
	import SquarePen from '@lucide/svelte/icons/square-pen';
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Separator } from '$lib/components/ui/separator';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { SvelteDate } from 'svelte/reactivity';
	import type { ChatUser } from '../data/types';
	import UserHoverCard from '$lib/components/shared/user-hover-card.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime.js';

	let {
		chatUsers,
		selectedUser,
		onSelectUser,
		search = $bindable(''),
		searchRef = $bindable<HTMLInputElement | null>(null),
		onNewChat
	}: {
		chatUsers: ChatUser[];
		selectedUser: ChatUser | null;
		onSelectUser: (user: ChatUser) => void;
		search: string;
		searchRef?: HTMLInputElement | null;
		onNewChat: () => void;
	} = $props();

	const now = new SvelteDate();

	$effect(() => {
		const id = setInterval(() => now.setTime(Date.now()), 60_000);
		return () => clearInterval(id);
	});

	let filteredChatList = $derived(
		chatUsers.filter(({ fullName }) => fullName.toLowerCase().includes(search.trim().toLowerCase()))
	);

	function formatRelativeTime(timestamp: string): string {
		const current = now.getTime();
		const then = new Date(timestamp).getTime();
		const diffMs = current - then;
		const diffSec = Math.floor(diffMs / 1000);
		const diffMin = Math.floor(diffSec / 60);
		const diffHr = Math.floor(diffMin / 60);
		const diffDay = Math.floor(diffHr / 24);

		const locale = getLocale();
		const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

		if (diffMin < 1) return rtf.format(0, 'minute');
		if (diffMin < 60) return rtf.format(-diffMin, 'minute');
		if (diffHr < 24) return rtf.format(-diffHr, 'hour');
		if (diffDay < 7) return rtf.format(-diffDay, 'day');

		return new Date(timestamp).toLocaleDateString(locale, {
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<div class="flex min-h-0 w-full flex-col gap-2 sm:w-56 lg:w-72 2xl:w-80">
	<div
		class="bg-background sticky top-0 z-10 -mx-4 px-4 pb-3 shadow-md sm:static sm:z-auto sm:mx-0 sm:p-0 sm:shadow-none"
	>
		<div class="flex items-center justify-between py-2">
			<div class="flex gap-2">
				<h1 class="text-2xl font-bold">{m.chats_inbox()}</h1>
				<MessagesSquare size={20} />
			</div>
			<Button
				size="icon"
				variant="ghost"
				onclick={onNewChat}
				class="rounded-lg"
				aria-label={m.chats_new_chat()}
			>
				<SquarePen size={24} class="stroke-muted-foreground" />
			</Button>
		</div>

		<label
			class={cn(
				'focus-within:ring-ring focus-within:ring-1 focus-within:outline-hidden',
				'border-border flex h-10 w-full items-center space-x-0 rounded-md border ps-2'
			)}
		>
			<Search size={15} class="text-muted-foreground me-2" />
			<span class="sr-only">{m.search_label()}</span>
			<input
				bind:this={searchRef}
				type="text"
				class="placeholder:text-muted-foreground w-full flex-1 bg-inherit text-base focus-visible:outline-hidden md:text-sm"
				placeholder={m.chats_search_placeholder()}
				bind:value={search}
			/>
		</label>
	</div>

	<ScrollArea class="-mx-3 min-h-0 flex-1 p-3">
		{#each filteredChatList as chatUser (chatUser.id)}
			{@const lastConvo = chatUser.messages[0]}
			{@const lastMsg =
				lastConvo.sender === 'You'
					? `${m.chats_sender_you()}: ${lastConvo.message}`
					: lastConvo.message}
			<button
				type="button"
				class={cn(
					'group hover:bg-accent hover:text-accent-foreground',
					'flex w-full rounded-md px-2 py-2 text-start text-sm',
					selectedUser?.id === chatUser.id && 'sm:bg-muted'
				)}
				onclick={() => onSelectUser(chatUser)}
			>
				<div class="flex w-full gap-2">
					<Avatar.Root>
						<Avatar.Image src={chatUser.avatar} alt={chatUser.username} />
						<Avatar.Fallback>{chatUser.username}</Avatar.Fallback>
					</Avatar.Root>
					<div class="flex-1 overflow-hidden">
						<div class="flex items-center justify-between">
							<UserHoverCard
								name={chatUser.fullName}
								avatar={chatUser.avatar}
								email={chatUser.email}
								role={chatUser.role}
								status={chatUser.onlineStatus ? m.hover_online() : m.hover_offline()}
							>
								<span class="col-start-2 row-span-2 font-medium">
									{chatUser.fullName}
								</span>
							</UserHoverCard>
							<span
								class="text-muted-foreground group-hover:text-accent-foreground/70 text-xs text-nowrap"
							>
								{formatRelativeTime(lastConvo.timestamp)}
							</span>
						</div>
						<span
							class="text-muted-foreground group-hover:text-accent-foreground/90 col-start-2 row-span-2 row-start-2 line-clamp-2 text-ellipsis"
						>
							{lastMsg}
						</span>
					</div>
				</div>
			</button>
			<Separator class="my-1" />
		{/each}
	</ScrollArea>
</div>
