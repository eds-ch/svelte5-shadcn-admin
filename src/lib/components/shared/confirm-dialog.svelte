<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { m } from '$lib/paraglide/messages.js';
	import type { Snippet } from 'svelte';

	let {
		open = $bindable(false),
		title,
		desc,
		confirmText = m.common_continue(),
		cancelText = m.common_cancel(),
		destructive = false,
		loading = false,
		disabled = false,
		onConfirm,
		children
	}: {
		open?: boolean;
		title: string;
		desc: string;
		confirmText?: string;
		cancelText?: string;
		destructive?: boolean;
		loading?: boolean;
		disabled?: boolean;
		onConfirm: () => void | Promise<void>;
		children?: Snippet;
	} = $props();
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{title}</AlertDialog.Title>
			<AlertDialog.Description>{desc}</AlertDialog.Description>
		</AlertDialog.Header>
		{#if children}
			{@render children()}
		{/if}
		<AlertDialog.Footer>
			<AlertDialog.Cancel disabled={loading}>{cancelText}</AlertDialog.Cancel>
			<Button
				variant={destructive ? 'destructive' : 'default'}
				onclick={onConfirm}
				disabled={disabled || loading}
			>
				{confirmText}
			</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
