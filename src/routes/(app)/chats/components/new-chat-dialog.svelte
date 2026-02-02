<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import X from '@lucide/svelte/icons/x';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Command from '$lib/components/ui/command';
	import * as Dialog from '$lib/components/ui/dialog';
	import type { ChatUser } from '../data/types';
	import { m } from '$lib/paraglide/messages.js';

	type User = Omit<ChatUser, 'messages'>;

	let {
		open = $bindable(false),
		users,
		onStartChat
	}: {
		open: boolean;
		users: User[];
		onStartChat?: (userIds: string[]) => void;
	} = $props();

	let selectedUsers = $state<User[]>([]);

	function handleSelectUser(user: User) {
		if (!selectedUsers.find((u) => u.id === user.id)) {
			selectedUsers = [...selectedUsers, user];
		} else {
			handleRemoveUser(user.id);
		}
	}

	function handleRemoveUser(userId: number) {
		selectedUsers = selectedUsers.filter((user) => user.id !== userId);
	}

	function handleOpenChange(newOpen: boolean) {
		open = newOpen;
		if (!newOpen) {
			selectedUsers = [];
		}
	}
</script>

<Dialog.Root {open} onOpenChange={handleOpenChange}>
	<Dialog.Content class="sm:max-w-[600px]">
		<Dialog.Header>
			<Dialog.Title>{m.chats_new_message()}</Dialog.Title>
		</Dialog.Header>
		<div class="flex flex-col gap-4">
			<div class="flex flex-wrap items-baseline gap-2">
				<span class="text-muted-foreground min-h-6 text-sm">{m.chats_to()}</span>
				{#each selectedUsers as user (user.id)}
					<Badge variant="default">
						{user.fullName}
						<button
							class="ring-offset-background focus:ring-ring ms-1 rounded-full outline-hidden focus:ring-2 focus:ring-offset-2"
							onclick={() => handleRemoveUser(user.id)}
							onkeydown={(e) => {
								if (e.key === 'Enter') handleRemoveUser(user.id);
							}}
							aria-label={m.chats_remove_user({ name: user.fullName })}
						>
							<X class="text-muted-foreground hover:text-foreground h-3 w-3" />
						</button>
					</Badge>
				{/each}
			</div>
			<Command.Root class="rounded-lg border">
				<Command.Input placeholder={m.chats_search_people()} class="text-foreground" />
				<Command.List>
					<Command.Empty>{m.chats_no_people()}</Command.Empty>
					<Command.Group>
						{#each users as user (user.id)}
							<Command.Item
								onSelect={() => handleSelectUser(user)}
								class="hover:bg-accent hover:text-accent-foreground flex items-center justify-between gap-2"
							>
								<div class="flex items-center gap-2">
									<Avatar.Root class="h-8 w-8">
										<Avatar.Image src={user.avatar} alt={user.fullName} />
										<Avatar.Fallback>{user.fullName.charAt(0)}</Avatar.Fallback>
									</Avatar.Root>
									<div class="flex flex-col">
										<span class="text-sm font-medium">{user.fullName}</span>
										<span class="text-accent-foreground/70 text-xs">
											{user.username}
										</span>
									</div>
								</div>
								{#if selectedUsers.find((u) => u.id === user.id)}
									<Check class="h-4 w-4" />
								{/if}
							</Command.Item>
						{/each}
					</Command.Group>
				</Command.List>
			</Command.Root>
			<Button
				variant="default"
				disabled={selectedUsers.length === 0}
				onclick={() => {
					onStartChat?.(selectedUsers.map((u) => String(u.id)));
					open = false;
					selectedUsers = [];
				}}
			>
				{m.chats_chat_button()}
			</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>
