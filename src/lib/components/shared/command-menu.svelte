<script lang="ts">
	import { goto } from '$app/navigation';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Sun from '@lucide/svelte/icons/sun';
	import Moon from '@lucide/svelte/icons/moon';
	import Monitor from '@lucide/svelte/icons/monitor';
	import Globe from '@lucide/svelte/icons/globe';
	import * as Command from '$lib/components/ui/command';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { getSearch } from '$lib/contexts/search.svelte';
	import { getTheme } from '$lib/contexts/theme.svelte';
	import { getNavGroups } from '$lib/data/nav-config';
	import { localeLabels } from '$lib/data/locale-labels';
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale, setLocale, locales, localizeHref } from '$lib/paraglide/runtime.js';
	import ErrorFallback from '$lib/components/shared/error-fallback.svelte';

	const search = getSearch();
	const theme = getTheme();

	function runCommand(command: () => unknown) {
		search.setOpen(false);
		command();
	}
</script>

<Command.Dialog bind:open={search.open}>
	<Command.Input placeholder={m.cmd_search_placeholder()} />
	<Command.List>
		<ScrollArea class="h-72 pe-1">
			<Command.Empty>{m.cmd_no_results()}</Command.Empty>
			<svelte:boundary onerror={(e) => console.error('[CommandNavGroups]', e)}>
				{#each getNavGroups() as group (group.title)}
					<Command.Group heading={group.title}>
						{#each group.items as navItem (navItem.title)}
							{#if navItem.url}
								<Command.Item
									value={navItem.title}
									onSelect={() => {
										runCommand(() => goto(localizeHref(navItem.url)));
									}}
								>
									<div class="flex size-4 items-center justify-center">
										<ArrowRight class="text-muted-foreground/80 size-2" />
									</div>
									{navItem.title}
								</Command.Item>
							{:else if navItem.items}
								{#each navItem.items as subItem (subItem.url)}
									<Command.Item
										value={`${navItem.title}-${subItem.url}`}
										onSelect={() => {
											runCommand(() => goto(localizeHref(subItem.url)));
										}}
									>
										<div class="flex size-4 items-center justify-center">
											<ArrowRight class="text-muted-foreground/80 size-2" />
										</div>
										{navItem.title}
										<ChevronRight class="size-3" />
										{subItem.title}
									</Command.Item>
								{/each}
							{/if}
						{/each}
					</Command.Group>
				{/each}
				{#snippet failed(error, reset)}
					<ErrorFallback {error} {reset} compact />
				{/snippet}
			</svelte:boundary>
			<Command.Separator />
			<Command.Group heading={m.cmd_group_language()}>
				{#each locales as code (code)}
					<Command.Item
						value={`language-${code}`}
						onSelect={() => runCommand(() => setLocale(code))}
					>
						<Globe />
						<span>{localeLabels[code]}</span>
						{#if code === getLocale()}
							<span class="text-muted-foreground ml-auto text-xs">✓</span>
						{/if}
					</Command.Item>
				{/each}
			</Command.Group>
			<Command.Separator />
			<Command.Group heading={m.cmd_group_theme()}>
				<Command.Item onSelect={() => runCommand(() => theme.setMode('light'))}>
					<Sun />
					<span>{m.common_theme_light()}</span>
				</Command.Item>
				<Command.Item onSelect={() => runCommand(() => theme.setMode('dark'))}>
					<Moon class="scale-90" />
					<span>{m.common_theme_dark()}</span>
				</Command.Item>
				<Command.Item onSelect={() => runCommand(() => theme.setMode('system'))}>
					<Monitor />
					<span>{m.common_theme_system()}</span>
				</Command.Item>
			</Command.Group>
		</ScrollArea>
	</Command.List>
</Command.Dialog>
