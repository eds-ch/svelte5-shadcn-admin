<script lang="ts">
	import type { Component } from 'svelte';
	import type { PageProps } from './$types';
	import type { MetricCard } from './data/dashboard';
	import AnimatedMetric from './components/animated-metric.svelte';
	import AppHeader from '$lib/components/layout/app-header.svelte';
	import Main from '$lib/components/layout/main.svelte';
	import TopNav from '$lib/components/layout/top-nav.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import DollarSign from '@lucide/svelte/icons/dollar-sign';
	import Users from '@lucide/svelte/icons/users';
	import CreditCard from '@lucide/svelte/icons/credit-card';
	import Activity from '@lucide/svelte/icons/activity';
	import MousePointerClick from '@lucide/svelte/icons/mouse-pointer-click';
	import UserCheck from '@lucide/svelte/icons/user-check';
	import TrendingDown from '@lucide/svelte/icons/trending-down';
	import Target from '@lucide/svelte/icons/target';
	import OverviewChart from './components/overview-chart.svelte';
	import RecentSales from './components/recent-sales.svelte';
	import AnalyticsChart from './components/analytics-chart.svelte';
	import SimpleBarList from './components/simple-bar-list.svelte';
	import { SvelteDate } from 'svelte/reactivity';
	import { innerWidth } from 'svelte/reactivity/window';
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import ErrorFallback from '$lib/components/shared/error-fallback.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime.js';
	import { BREAKPOINT, pageTitle } from '$lib/config';
	import { whenVisible } from '$lib/attachments/intersection-observer';
	import { cookiePaneStorage } from '$lib/utils/cookie-pane-storage.js';

	let { data }: PageProps = $props();

	let activeTab = $state('overview');
	let analyticsVisible = $state(false);

	const pageLoadTime = Date.now();
	const now = new SvelteDate();

	$effect(() => {
		const id = setInterval(() => now.setTime(Date.now()), 60_000);
		return () => clearInterval(id);
	});

	const lastUpdatedText = $derived.by(() => {
		const diffMs = now.getTime() - pageLoadTime;
		const diffSec = Math.floor(diffMs / 1000);
		const diffMin = Math.floor(diffSec / 60);
		const diffHr = Math.floor(diffMin / 60);

		const locale = getLocale();
		const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

		if (diffMin < 1) return rtf.format(0, 'minute');
		if (diffMin < 60) return rtf.format(-diffMin, 'minute');
		return rtf.format(-diffHr, 'hour');
	});

	const iconMap: Record<string, Component> = {
		'dollar-sign': DollarSign,
		users: Users,
		'credit-card': CreditCard,
		activity: Activity,
		'mouse-pointer-click': MousePointerClick,
		'user-check': UserCheck,
		'trending-down': TrendingDown,
		target: Target
	};

	const isDesktop = $derived((innerWidth.current ?? BREAKPOINT.lg) >= BREAKPOINT.lg);

	const topNav = $derived([
		{ title: m.dash_tab_overview(), href: '/', isActive: true },
		{ title: m.dash_topnav_customers(), href: '/customers', isActive: false, disabled: true },
		{ title: m.dash_topnav_products(), href: '/products', isActive: false, disabled: true },
		{ title: m.nav_settings(), href: '/settings', isActive: false, disabled: true }
	]);
</script>

<svelte:head>
	<title>{pageTitle(m.dash_title())}</title>
</svelte:head>

<AppHeader>
	<TopNav links={topNav} />
</AppHeader>

{#snippet metricCards(metrics: MetricCard[])}
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		{#each metrics as metric (metric.title)}
			{@const Icon = iconMap[metric.icon]}
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">{metric.title}</Card.Title>
					<Icon class="text-muted-foreground h-4 w-4" />
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">
						<AnimatedMetric
							value={metric.numericValue}
							format={metric.valueFormat}
							locale={getLocale()}
						/>
					</div>
					<p class="text-muted-foreground text-xs">{metric.change}</p>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
{/snippet}

{#snippet overviewChartCard()}
	<svelte:boundary onerror={(e) => console.error('[OverviewChart]', e)}>
		<Card.Root class="h-full">
			<Card.Header>
				<Card.Title>{m.dash_card_overview()}</Card.Title>
			</Card.Header>
			<Card.Content class="px-6">
				<OverviewChart data={data.overviewChartData} />
			</Card.Content>
		</Card.Root>
		{#snippet failed(error, reset)}
			<ErrorFallback {error} {reset} />
		{/snippet}
	</svelte:boundary>
{/snippet}

{#snippet overviewSalesCard()}
	<svelte:boundary onerror={(e) => console.error('[RecentSales]', e)}>
		<Card.Root class="h-full">
			<Card.Header>
				<Card.Title>{m.dash_card_recent_sales()}</Card.Title>
				<Card.Description
					>{m.dash_sales_this_month({ count: String(data.salesCount) })}</Card.Description
				>
			</Card.Header>
			<Card.Content>
				<RecentSales sales={data.recentSales} />
			</Card.Content>
		</Card.Root>
		{#snippet failed(error, reset)}
			<ErrorFallback {error} {reset} />
		{/snippet}
	</svelte:boundary>
{/snippet}

{#snippet analyticsReferrersCard()}
	<svelte:boundary onerror={(e) => console.error('[ReferrersList]', e)}>
		<Card.Root>
			<Card.Header>
				<Card.Title>{m.dash_card_referrers()}</Card.Title>
				<Card.Description>{m.dash_referrers_desc()}</Card.Description>
			</Card.Header>
			<Card.Content>
				<SimpleBarList
					items={data.referrers}
					barClass="bg-primary"
					valueFormatter={(n) => `${n}`}
				/>
			</Card.Content>
		</Card.Root>
		{#snippet failed(error, reset)}
			<ErrorFallback {error} {reset} />
		{/snippet}
	</svelte:boundary>
{/snippet}

{#snippet analyticsDevicesCard()}
	<svelte:boundary onerror={(e) => console.error('[DevicesList]', e)}>
		<Card.Root>
			<Card.Header>
				<Card.Title>{m.dash_card_devices()}</Card.Title>
				<Card.Description>{m.dash_devices_desc()}</Card.Description>
			</Card.Header>
			<Card.Content>
				<SimpleBarList
					items={data.devices}
					barClass="bg-muted-foreground"
					valueFormatter={(n) => `${n}%`}
				/>
			</Card.Content>
		</Card.Root>
		{#snippet failed(error, reset)}
			<ErrorFallback {error} {reset} />
		{/snippet}
	</svelte:boundary>
{/snippet}

<Main class="gap-2">
	<div class="mb-2 flex items-center justify-between space-y-2">
		<div>
			<h1 class="text-2xl font-bold tracking-tight">{m.dash_title()}</h1>
			<p class="text-muted-foreground">
				{m.dash_last_updated({ time: lastUpdatedText })}
			</p>
		</div>
		<div class="flex items-center space-x-2">
			<Button>{m.dash_download()}</Button>
		</div>
	</div>

	<Tabs.Root bind:value={activeTab} class="space-y-4">
		<div class="w-full overflow-x-auto pb-2">
			<Tabs.List>
				<Tabs.Trigger value="overview">{m.dash_tab_overview()}</Tabs.Trigger>
				<Tabs.Trigger value="analytics">{m.dash_tab_analytics()}</Tabs.Trigger>
				<Tabs.Trigger value="reports" disabled>{m.dash_tab_reports()}</Tabs.Trigger>
				<Tabs.Trigger value="notifications" disabled>{m.dash_tab_notifications()}</Tabs.Trigger>
			</Tabs.List>
		</div>

		<Tabs.Content value="overview" class="space-y-4">
			{#if isDesktop}
				<svelte:boundary onerror={(e) => console.error('[OverviewMetrics]', e)}>
					{@render metricCards(data.overviewMetrics)}
					{#snippet failed(error, reset)}
						<ErrorFallback {error} {reset} />
					{/snippet}
				</svelte:boundary>
				<Resizable.PaneGroup
					direction="horizontal"
					autoSaveId="dashboard-overview"
					storage={cookiePaneStorage}
					class="!h-auto gap-4 !overflow-visible"
				>
					<Resizable.Pane defaultSize={57} minSize={30} class="!overflow-visible">
						{@render overviewChartCard()}
					</Resizable.Pane>
					<Resizable.Handle withHandle />
					<Resizable.Pane defaultSize={43} minSize={30} class="!overflow-visible">
						{@render overviewSalesCard()}
					</Resizable.Pane>
				</Resizable.PaneGroup>
			{:else}
				<svelte:boundary onerror={(e) => console.error('[OverviewMetrics]', e)}>
					{@render metricCards(data.overviewMetrics)}
					{#snippet failed(error, reset)}
						<ErrorFallback {error} {reset} />
					{/snippet}
				</svelte:boundary>
				<div class="grid grid-cols-1 gap-4">
					{@render overviewChartCard()}
					{@render overviewSalesCard()}
				</div>
			{/if}
		</Tabs.Content>

		<Tabs.Content value="analytics" class="space-y-4">
			<svelte:boundary onerror={(e) => console.error('[AnalyticsChart]', e)}>
				<Card.Root {@attach whenVisible(() => (analyticsVisible = true), { once: true })}>
					<Card.Header>
						<Card.Title>{m.dash_card_traffic_overview()}</Card.Title>
						<Card.Description>{m.dash_traffic_desc()}</Card.Description>
					</Card.Header>
					<Card.Content class="px-6">
						{#if activeTab === 'analytics' && analyticsVisible}
							<AnalyticsChart data={data.analyticsChartData} />
						{/if}
					</Card.Content>
				</Card.Root>
				{#snippet failed(error, reset)}
					<ErrorFallback {error} {reset} />
				{/snippet}
			</svelte:boundary>

			<svelte:boundary onerror={(e) => console.error('[AnalyticsMetrics]', e)}>
				{@render metricCards(data.analyticsMetrics)}
				{#snippet failed(error, reset)}
					<ErrorFallback {error} {reset} />
				{/snippet}
			</svelte:boundary>

			{#if isDesktop}
				<Resizable.PaneGroup
					direction="horizontal"
					autoSaveId="dashboard-analytics"
					storage={cookiePaneStorage}
					class="!h-auto gap-4 !overflow-visible"
				>
					<Resizable.Pane defaultSize={57} minSize={30} class="!overflow-visible">
						{@render analyticsReferrersCard()}
					</Resizable.Pane>
					<Resizable.Handle withHandle />
					<Resizable.Pane defaultSize={43} minSize={30} class="!overflow-visible">
						{@render analyticsDevicesCard()}
					</Resizable.Pane>
				</Resizable.PaneGroup>
			{:else}
				<div class="grid grid-cols-1 gap-4">
					{@render analyticsReferrersCard()}
					{@render analyticsDevicesCard()}
				</div>
			{/if}
		</Tabs.Content>
	</Tabs.Root>
</Main>
