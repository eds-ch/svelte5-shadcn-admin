<script lang="ts">
	import Globe from '@lucide/svelte/icons/globe';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { getLocale, setLocale, locales } from '$lib/paraglide/runtime.js';
	import type { Locale } from '$lib/paraglide/runtime.js';
	import { m } from '$lib/paraglide/messages.js';
	import { localeLabels } from '$lib/data/locale-labels';
	import { tooltip } from '$lib/attachments/tooltip';

	function switchLocale(locale: Locale) {
		if (locale === getLocale()) return;
		setLocale(locale);
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				{@attach tooltip(m.common_switch_language())}
				variant="ghost"
				size="icon"
				class="size-7"
			>
				<Globe class="size-[1.2rem]" />
				<span class="sr-only">{m.common_switch_language()}</span>
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		{#each locales as code (code)}
			<DropdownMenu.Item
				onclick={() => switchLocale(code)}
				class={code === getLocale() ? 'bg-accent' : ''}
			>
				{localeLabels[code]}
			</DropdownMenu.Item>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
