<script lang="ts">
	import Sun from '@lucide/svelte/icons/sun';
	import Moon from '@lucide/svelte/icons/moon';
	import Monitor from '@lucide/svelte/icons/monitor';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { getTheme } from '$lib/contexts/theme.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { tooltip } from '$lib/attachments/tooltip';

	const theme = getTheme();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				{@attach tooltip(m.common_toggle_theme())}
				variant="ghost"
				size="icon"
				class="size-7"
			>
				<Sun class="size-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
				<Moon
					class="absolute size-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
				/>
				<span class="sr-only">{m.common_toggle_theme()}</span>
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item onclick={() => theme.setMode('light')}>
			<Sun class="size-4" />
			{m.common_theme_light()}
		</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => theme.setMode('dark')}>
			<Moon class="size-4" />
			{m.common_theme_dark()}
		</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => theme.setMode('system')}>
			<Monitor class="size-4" />
			{m.common_theme_system()}
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
