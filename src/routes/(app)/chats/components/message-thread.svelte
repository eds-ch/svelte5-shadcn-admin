<script lang="ts">
	import { tick } from 'svelte';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import Ellipsis from '@lucide/svelte/icons/ellipsis-vertical';
	import Phone from '@lucide/svelte/icons/phone';
	import Video from '@lucide/svelte/icons/video';
	import Plus from '@lucide/svelte/icons/plus';
	import ImagePlus from '@lucide/svelte/icons/image-plus';
	import Paperclip from '@lucide/svelte/icons/paperclip';
	import Send from '@lucide/svelte/icons/send';
	import MessagesSquare from '@lucide/svelte/icons/messages-square';
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import * as Avatar from '$lib/components/ui/avatar';
	import type { ChatUser } from '../data/types';
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime.js';
	import { tooltip } from '$lib/attachments/tooltip';
	import { autoResize } from '$lib/attachments/auto-resize';

	let {
		selectedUser,
		sending = false,
		mobileSelected,
		onBackClick,
		onNewChat,
		onSendMessage,
		messageDraft = $bindable('')
	}: {
		selectedUser: ChatUser | null;
		sending?: boolean;
		mobileSelected: boolean;
		onBackClick: () => void;
		onNewChat: () => void;
		onSendMessage: (message: string) => void;
		messageDraft?: string;
	} = $props();
	let scrollContainer = $state<HTMLDivElement | undefined>(undefined);

	function formatDate(timestamp: string): string {
		const date = new Date(timestamp);
		return date.toLocaleDateString(getLocale(), {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}

	function formatTime(timestamp: string): string {
		const date = new Date(timestamp);
		return date.toLocaleTimeString(getLocale(), {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		});
	}

	let currentMessages = $derived.by(() => {
		if (!selectedUser) return null;
		const grouped: Record<string, typeof selectedUser.messages> = {};
		for (const msg of selectedUser.messages) {
			const key = formatDate(msg.timestamp);
			if (!grouped[key]) {
				grouped[key] = [];
			}
			grouped[key].push(msg);
		}
		return grouped;
	});

	async function handleSend(e: SubmitEvent) {
		e.preventDefault();
		if (!messageDraft.trim() || !selectedUser) return;
		onSendMessage(messageDraft.trim());
		messageDraft = '';
		await tick();
		if (scrollContainer) {
			scrollContainer.scrollTop = scrollContainer.scrollHeight;
		}
	}
</script>

{#if selectedUser}
	<div
		class={cn(
			'bg-background absolute inset-0 start-full z-50 hidden w-full flex-1 flex-col border shadow-xs sm:static sm:z-auto sm:flex sm:rounded-md',
			mobileSelected && 'start-0 flex'
		)}
	>
		<div class="bg-card mb-1 flex flex-none justify-between p-4 shadow-lg sm:rounded-t-md">
			<div class="flex gap-3">
				<Button
					size="icon"
					variant="ghost"
					class="-ms-2 h-full sm:hidden"
					onclick={onBackClick}
					aria-label={m.chats_back_to_conversations()}
				>
					<ArrowLeft class="rtl:rotate-180" />
				</Button>
				<div class="flex items-center gap-2 lg:gap-4">
					<Avatar.Root class="size-9 lg:size-11">
						<Avatar.Image src={selectedUser.avatar} alt={selectedUser.username} />
						<Avatar.Fallback>{selectedUser.username}</Avatar.Fallback>
					</Avatar.Root>
					<div>
						<span class="col-start-2 row-span-2 text-sm font-medium lg:text-base">
							{selectedUser.fullName}
						</span>
						<span
							class="text-muted-foreground col-start-2 row-span-2 row-start-2 line-clamp-1 block max-w-32 text-xs text-nowrap text-ellipsis lg:max-w-none lg:text-sm"
						>
							{selectedUser.title}
						</span>
					</div>
				</div>
			</div>

			<div class="-me-1 flex items-center gap-1 lg:gap-2">
				<Button
					size="icon"
					variant="ghost"
					class="hidden size-8 rounded-full sm:inline-flex lg:size-10"
					aria-label={m.chats_video_call()}
					{@attach tooltip(m.chats_video_call())}
				>
					<Video size={22} class="stroke-muted-foreground" />
				</Button>
				<Button
					size="icon"
					variant="ghost"
					class="hidden size-8 rounded-full sm:inline-flex lg:size-10"
					aria-label={m.chats_phone_call()}
					{@attach tooltip(m.chats_phone_call())}
				>
					<Phone size={22} class="stroke-muted-foreground" />
				</Button>
				<Button
					size="icon"
					variant="ghost"
					class="h-10 rounded-md sm:h-8 sm:w-4 lg:h-10 lg:w-6"
					aria-label={m.chats_more_options()}
					{@attach tooltip(m.chats_more_options())}
				>
					<Ellipsis class="stroke-muted-foreground sm:size-5" />
				</Button>
			</div>
		</div>

		<div class="flex flex-1 flex-col gap-2 rounded-md px-4 pt-0 pb-4">
			<div class="flex size-full flex-1">
				<div class="chat-text-container relative -me-4 flex flex-1 flex-col overflow-y-hidden">
					<div
						bind:this={scrollContainer}
						class="chat-flex flex h-40 w-full grow flex-col-reverse justify-start gap-4 overflow-y-auto py-2 pe-4 pb-4"
						role="log"
						aria-live="polite"
					>
						{#if sending}
							<div class="text-muted-foreground self-end text-xs italic">
								{m.chat_sending()}
							</div>
						{/if}
						{#if currentMessages}
							{#each Object.keys(currentMessages) as dateKey (dateKey)}
								{#each currentMessages[dateKey] as msg, index (`${msg.sender}-${msg.timestamp}-${index}`)}
									<div
										class={cn(
											'chat-box max-w-72 px-3 py-2 break-words shadow-lg',
											msg.sender === 'You'
												? 'bg-primary/90 text-primary-foreground/75 self-end rounded-[16px_16px_0_16px]'
												: 'bg-muted self-start rounded-[16px_16px_16px_0]'
										)}
									>
										{msg.message}
										<span
											class={cn(
												'text-foreground/75 mt-1 block text-xs font-light italic',
												msg.sender === 'You' && 'text-primary-foreground/85 text-end'
											)}
										>
											{formatTime(msg.timestamp)}
										</span>
									</div>
								{/each}
								<div class="text-center text-xs">{dateKey}</div>
							{/each}
						{/if}
					</div>
				</div>
			</div>
			<form class="flex w-full flex-none gap-2" onsubmit={handleSend}>
				<div
					class="border-input bg-card focus-within:ring-ring flex flex-1 items-center gap-2 rounded-md border px-2 py-1 focus-within:ring-1 focus-within:outline-hidden lg:gap-4"
				>
					<div class="space-x-1">
						<Button
							size="icon"
							type="button"
							variant="ghost"
							class="h-8 rounded-md"
							aria-label={m.chats_add_attachment()}
						>
							<Plus size={20} class="stroke-muted-foreground" />
						</Button>
						<Button
							size="icon"
							type="button"
							variant="ghost"
							class="hidden h-8 rounded-md lg:inline-flex"
							aria-label={m.chats_add_image()}
						>
							<ImagePlus size={20} class="stroke-muted-foreground" />
						</Button>
						<Button
							size="icon"
							type="button"
							variant="ghost"
							class="hidden h-8 rounded-md lg:inline-flex"
							aria-label={m.chats_attach_file()}
						>
							<Paperclip size={20} class="stroke-muted-foreground" />
						</Button>
					</div>
					<label class="flex-1">
						<span class="sr-only">{m.chats_type_message()}</span>
						<textarea
							rows="1"
							placeholder={m.chats_type_message()}
							class="placeholder:text-muted-foreground h-8 w-full resize-none bg-inherit text-base focus-visible:outline-hidden md:text-sm"
							bind:value={messageDraft}
							{@attach autoResize({ maxHeight: 120 })}
							onkeydown={(e) => {
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault();
									e.currentTarget.form?.requestSubmit();
								}
							}}
						></textarea>
					</label>
					<Button
						variant="ghost"
						size="icon"
						type="submit"
						class="hidden sm:inline-flex"
						aria-label={m.chats_send_message()}
					>
						<Send size={20} />
					</Button>
				</div>
				<Button type="submit" class="h-full sm:hidden">
					<Send size={18} />
					{m.chats_send()}
				</Button>
			</form>
		</div>
	</div>
{:else}
	<div
		class={cn(
			'bg-card absolute inset-0 start-full z-50 hidden w-full flex-1 flex-col justify-center rounded-md border shadow-xs sm:static sm:z-auto sm:flex'
		)}
	>
		<div class="flex flex-col items-center space-y-6">
			<div class="border-border flex size-16 items-center justify-center rounded-full border-2">
				<MessagesSquare class="size-8" />
			</div>
			<div class="space-y-2 text-center">
				<h1 class="text-xl font-semibold">{m.chats_your_messages()}</h1>
				<p class="text-muted-foreground text-sm">{m.chats_send_to_start()}</p>
			</div>
			<Button onclick={onNewChat}>{m.chats_send_message()}</Button>
		</div>
	</div>
{/if}
