<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import Eye from '@lucide/svelte/icons/eye';
	import EyeOff from '@lucide/svelte/icons/eye-off';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { m } from '$lib/paraglide/messages.js';

	let {
		class: className,
		value = $bindable(),
		disabled,
		...restProps
	}: Omit<HTMLInputAttributes, 'type' | 'files'> & { value?: string } = $props();

	let showPassword = $state(false);
</script>

<div class={cn('relative rounded-md', className)}>
	<Input
		type={showPassword ? 'text' : 'password'}
		class="pr-10"
		bind:value
		{disabled}
		{...restProps}
	/>
	<Button
		type="button"
		size="icon"
		variant="ghost"
		{disabled}
		class="text-muted-foreground absolute end-1 top-1/2 h-6 w-6 -translate-y-1/2"
		onclick={() => (showPassword = !showPassword)}
		aria-label={showPassword ? m.auth_hide_password() : m.auth_show_password()}
	>
		{#if showPassword}
			<EyeOff size={18} />
		{:else}
			<Eye size={18} />
		{/if}
	</Button>
</div>
