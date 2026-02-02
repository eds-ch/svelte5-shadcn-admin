<script lang="ts">
	import AppHeader from '$lib/components/layout/app-header.svelte';
	import Main from '$lib/components/layout/main.svelte';
	import ConversationList from './components/conversation-list.svelte';
	import MessageThread from './components/message-thread.svelte';
	import NewChatDialog from './components/new-chat-dialog.svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import { innerWidth } from 'svelte/reactivity/window';
	import { toast } from 'svelte-sonner';
	import type { ChatUser } from './data/types';
	import type { Snapshot } from './$types';
	import { simulateServer } from '$lib/utils/simulate-server.js';
	import { m } from '$lib/paraglide/messages.js';
	import { BREAKPOINT, pageTitle } from '$lib/config';
	import ErrorFallback from '$lib/components/shared/error-fallback.svelte';
	import { getShortcuts } from '$lib/contexts/shortcuts.svelte.js';

	let { data } = $props();

	let selectedUser = $state<ChatUser | null>(null);
	let search = $state('');
	let chatSearchRef = $state<HTMLInputElement | null>(null);
	let newChatOpen = $state(false);
	let messageDraft = $state('');
	let sending = $state(false);

	const isMobile = $derived((innerWidth.current ?? BREAKPOINT.lg) < BREAKPOINT.md);
	const chatUsersMap = $derived(new SvelteMap(data.chatUsers.map((u) => [u.id, u] as const)));

	const shortcutRegistry = getShortcuts();
	$effect(() => {
		return shortcutRegistry.register([
			{
				key: 'n',
				label: m.shortcut_new_chat(),
				action: () => (newChatOpen = true),
				scope: 'chats'
			},
			{
				key: '/',
				label: m.shortcut_search(),
				action: () => chatSearchRef?.focus(),
				scope: 'chats'
			}
		]);
	});

	export const snapshot: Snapshot<{
		selectedUserId: number | null;
		search: string;
		messageDraft: string;
	}> = {
		capture: () => ({
			selectedUserId: selectedUser?.id ?? null,
			search,
			messageDraft
		}),
		restore: (value) => {
			search = value.search;
			messageDraft = value.messageDraft;
			if (value.selectedUserId !== null) {
				selectedUser = chatUsersMap.get(value.selectedUserId) ?? null;
			}
		}
	};

	const users = $derived(data.chatUsers.map(({ messages: _, ...user }) => user));

	function handleSelectUser(user: ChatUser) {
		selectedUser = user;
	}

	async function handleSendMessage(message: string) {
		if (!selectedUser) return;
		const prevMessages = selectedUser.messages;
		selectedUser.messages = [
			{
				sender: 'You',
				message,
				timestamp: new Date().toISOString()
			},
			...selectedUser.messages
		];
		messageDraft = '';
		sending = true;
		try {
			await simulateServer(null);
		} catch {
			selectedUser.messages = prevMessages;
			toast.error(m.toast_action_failed());
		} finally {
			sending = false;
		}
	}
</script>

<svelte:head>
	<title>{pageTitle(m.nav_chats())}</title>
</svelte:head>

<AppHeader fixed={false} />

<Main fixed>
	<section class="flex h-full gap-6">
		<svelte:boundary onerror={(e) => console.error('[ConversationList]', e)}>
			<ConversationList
				chatUsers={data.chatUsers}
				{selectedUser}
				onSelectUser={handleSelectUser}
				bind:search
				bind:searchRef={chatSearchRef}
				onNewChat={() => (newChatOpen = true)}
			/>
			{#snippet failed(error, reset)}
				<ErrorFallback {error} {reset} />
			{/snippet}
		</svelte:boundary>

		<svelte:boundary onerror={(e) => console.error('[MessageThread]', e)}>
			<MessageThread
				{selectedUser}
				{sending}
				mobileSelected={isMobile && selectedUser !== null}
				onBackClick={() => (selectedUser = null)}
				onNewChat={() => (newChatOpen = true)}
				onSendMessage={handleSendMessage}
				bind:messageDraft
			/>
			{#snippet failed(error, reset)}
				<ErrorFallback {error} {reset} />
			{/snippet}
		</svelte:boundary>
	</section>

	<svelte:boundary onerror={(e) => console.error('[NewChatDialog]', e)}>
		<NewChatDialog bind:open={newChatOpen} {users} />
		{#snippet failed(error, reset)}
			<ErrorFallback {error} {reset} />
		{/snippet}
	</svelte:boundary>
</Main>
