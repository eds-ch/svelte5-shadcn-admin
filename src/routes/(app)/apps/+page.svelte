<script lang="ts">
	import ArrowDownAZ from '@lucide/svelte/icons/arrow-down-a-z';
	import ArrowUpAZ from '@lucide/svelte/icons/arrow-up-a-z';
	import SlidersHorizontal from '@lucide/svelte/icons/sliders-horizontal';
	import AppHeader from '$lib/components/layout/app-header.svelte';
	import Main from '$lib/components/layout/main.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Separator } from '$lib/components/ui/separator';
	import { createFilterSync } from '$lib/hooks/url-filter-sync.svelte.js';
	import type { App } from './data/apps.js';
	import type { Snapshot } from './$types';
	import { m } from '$lib/paraglide/messages.js';
	import { COOKIE, pageTitle } from '$lib/config';
	import ErrorFallback from '$lib/components/shared/error-fallback.svelte';
	import { tooltip } from '$lib/attachments/tooltip';
	import { getShortcuts } from '$lib/contexts/shortcuts.svelte.js';
	import LayoutGridIcon from '@lucide/svelte/icons/layout-grid';
	import ListIcon from '@lucide/svelte/icons/list';
	import ViewModeSwitcher from '$lib/components/shared/view-mode-switcher.svelte';
	type AppType = 'all' | 'connected' | 'notConnected';

	let { data } = $props();

	const urlSync = createFilterSync();

	const appTypeLabels = $derived<Record<AppType, string>>({
		all: m.apps_all(),
		connected: m.apps_connected(),
		notConnected: m.apps_not_connected()
	});

	let searchTerm = $state(urlSync.params.get('search') ?? '');
	let searchInputRef = $state<HTMLInputElement | null>(null);
	let appType = $state<AppType>((urlSync.params.get('type') as AppType) ?? 'all');
	let sort = $state<'asc' | 'desc'>((urlSync.params.get('sort') as 'asc' | 'desc') ?? 'asc');

	// svelte-ignore state_referenced_locally
	let viewMode = $state(data.viewApps ?? COOKIE.defaults.viewApps);
	const appViewModes = $derived([
		{ value: 'grid', icon: LayoutGridIcon, label: m.view_mode_grid() },
		{ value: 'list', icon: ListIcon, label: m.view_mode_list() }
	]);
	function onViewModeChange(value: string) {
		document.cookie = `${COOKIE.viewApps}=${value};path=/;max-age=${COOKIE.maxAge.long};samesite=lax`;
	}

	export const snapshot: Snapshot<{ searchTerm: string; appType: AppType; sort: 'asc' | 'desc' }> =
		{
			capture: () => ({ searchTerm, appType, sort }),
			restore: (value) => {
				searchTerm = value.searchTerm;
				appType = value.appType;
				sort = value.sort;
			}
		};

	$effect(() => {
		urlSync.update({
			search: searchTerm || null,
			type: appType === 'all' ? null : appType,
			sort: sort === 'asc' ? null : sort
		});
	});

	const shortcutRegistry = getShortcuts();
	$effect(() => {
		return shortcutRegistry.register([
			{
				key: '/',
				label: m.shortcut_search(),
				action: () => searchInputRef?.focus(),
				scope: 'apps'
			}
		]);
	});

	function matchesAppType(app: App): boolean {
		if (appType === 'connected') return app.connected;
		if (appType === 'notConnected') return !app.connected;
		return true;
	}

	const filteredApps = $derived.by(() => {
		return [...data.apps]
			.sort((a, b) =>
				sort === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
			)
			.filter(matchesAppType)
			.filter((app) => app.name.toLowerCase().includes(searchTerm.toLowerCase()));
	});
</script>

<svelte:head>
	<title>{pageTitle(m.apps_title())}</title>
</svelte:head>

<AppHeader />

<Main fixed>
	<div>
		<h1 class="text-2xl font-bold tracking-tight">{m.apps_title()}</h1>
		<p class="text-muted-foreground">{m.apps_subtitle()}</p>
	</div>

	<div class="my-4 flex items-end justify-between sm:my-0 sm:items-center">
		<div class="flex flex-col gap-4 sm:my-4 sm:flex-row">
			<Input
				bind:ref={searchInputRef}
				placeholder={m.apps_filter_placeholder()}
				class="h-8 w-40 lg:w-[250px]"
				bind:value={searchTerm}
			/>
			<Select.Root type="single" bind:value={appType}>
				<Select.Trigger size="sm" class="w-36">
					{appTypeLabels[appType]}
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="all">{m.apps_all()}</Select.Item>
					<Select.Item value="connected">{m.apps_connected()}</Select.Item>
					<Select.Item value="notConnected">{m.apps_not_connected()}</Select.Item>
				</Select.Content>
			</Select.Root>
		</div>

		<div class="flex items-center gap-2">
			<ViewModeSwitcher modes={appViewModes} bind:value={viewMode} onchange={onViewModeChange} />
			<Select.Root type="single" bind:value={sort}>
				<Select.Trigger size="sm" class="w-16" aria-label={m.apps_sort_order()}>
					<SlidersHorizontal class="size-[18px]" />
				</Select.Trigger>
				<Select.Content align="end">
					<Select.Item value="asc">
						<div class="flex items-center gap-4">
							<ArrowUpAZ class="size-4" />
							<span>{m.apps_sort_ascending()}</span>
						</div>
					</Select.Item>
					<Select.Item value="desc">
						<div class="flex items-center gap-4">
							<ArrowDownAZ class="size-4" />
							<span>{m.apps_sort_descending()}</span>
						</div>
					</Select.Item>
				</Select.Content>
			</Select.Root>
		</div>
	</div>

	<Separator class="shadow-sm" />

	<svelte:boundary onerror={(e) => console.error('[AppsGrid]', e)}>
		<div class="faded-bottom min-h-0 flex-1">
			<ul
				class="no-scrollbar -mx-2 grid h-full gap-4 overflow-y-auto px-2 pt-4 pb-16 {viewMode ===
				'grid'
					? 'md:grid-cols-2 lg:grid-cols-3'
					: 'grid-cols-1'}"
			>
				{#each filteredApps as app (app.id)}
					{#if viewMode === 'list'}
						<li
							class="flex items-center gap-4 rounded-lg border p-4 hover:shadow-md"
							aria-label="{app.name} — {app.connected
								? m.apps_connected()
								: m.apps_not_connected()}"
						>
							<div
								class="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg p-2"
							>
								<app.logo />
							</div>
							<div class="min-w-0 flex-1">
								<h2 class="font-semibold">{app.name}</h2>
								<p class="text-muted-foreground truncate text-sm">{app.desc}</p>
							</div>
							<Button
								{@attach tooltip(app.connected ? m.apps_connected() : m.apps_connect_tooltip())}
								variant="outline"
								size="sm"
								class="shrink-0 {app.connected
									? 'border-primary/30 bg-primary/5 hover:bg-primary/10'
									: ''}"
							>
								{app.connected ? m.apps_connected() : m.apps_connect()}
							</Button>
						</li>
					{:else}
						<li
							class="rounded-lg border p-4 hover:shadow-md"
							aria-label="{app.name} — {app.connected
								? m.apps_connected()
								: m.apps_not_connected()}"
						>
							<div class="mb-8 flex items-center justify-between">
								<div class="bg-muted flex size-10 items-center justify-center rounded-lg p-2">
									<app.logo />
								</div>
								<Button
									{@attach tooltip(app.connected ? m.apps_connected() : m.apps_connect_tooltip())}
									variant="outline"
									size="sm"
									class={app.connected ? 'border-primary/30 bg-primary/5 hover:bg-primary/10' : ''}
								>
									{app.connected ? m.apps_connected() : m.apps_connect()}
								</Button>
							</div>
							<div>
								<h2 class="mb-1 font-semibold">{app.name}</h2>
								<p class="text-muted-foreground line-clamp-2">{app.desc}</p>
							</div>
						</li>
					{/if}
				{:else}
					<li class="col-span-full list-none text-center text-muted-foreground py-12">
						{m.apps_no_results()}
					</li>
				{/each}
			</ul>
		</div>
		{#snippet failed(error, reset)}
			<ErrorFallback {error} {reset} />
		{/snippet}
	</svelte:boundary>
</Main>
