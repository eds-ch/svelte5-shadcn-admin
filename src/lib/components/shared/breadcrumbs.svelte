<script lang="ts">
	import { page } from '$app/state';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { localizeHref, deLocalizeHref } from '$lib/paraglide/runtime.js';
	import { m } from '$lib/paraglide/messages.js';

	type BreadcrumbItem = {
		label: string;
		href: string;
	};

	const segmentLabels: Record<string, () => string> = {
		dashboard: m.nav_dashboard,
		tasks: m.nav_tasks,
		apps: m.nav_apps,
		chats: m.nav_chats,
		users: m.nav_users,
		settings: m.nav_settings,
		account: m.nav_account,
		appearance: m.nav_appearance,
		notifications: m.nav_notifications,
		display: m.nav_display,
		'help-center': m.nav_help_center
	};

	function getSegmentLabel(segment: string): string {
		const messageFn = segmentLabels[segment];
		if (messageFn) return messageFn();
		// Fallback: capitalize hyphenated words
		return segment
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

	const segments = $derived.by(() => {
		const pathname = deLocalizeHref(page.url.pathname);
		const parts = pathname.split('/').filter(Boolean);

		return parts.map<BreadcrumbItem>((segment, index) => ({
			label: getSegmentLabel(segment),
			href: localizeHref('/' + parts.slice(0, index + 1).join('/'))
		}));
	});
</script>

<Breadcrumb.Root>
	<Breadcrumb.List>
		<Breadcrumb.Item>
			{#if segments.length > 0}
				<Breadcrumb.Link href={localizeHref('/')}>{m.breadcrumb_home()}</Breadcrumb.Link>
			{:else}
				<Breadcrumb.Page>{m.breadcrumb_home()}</Breadcrumb.Page>
			{/if}
		</Breadcrumb.Item>

		{#if segments.length > 3}
			<Breadcrumb.Separator />
			<Breadcrumb.Item>
				<Breadcrumb.Ellipsis />
			</Breadcrumb.Item>
		{/if}

		{#each segments.length > 3 ? segments.slice(-2) : segments as segment, i (segment.href)}
			<Breadcrumb.Separator />
			<Breadcrumb.Item>
				{#if segments.length > 3}
					{@const isLast = i === 1}
					{#if isLast}
						<Breadcrumb.Page>{segment.label}</Breadcrumb.Page>
					{:else}
						<Breadcrumb.Link href={segment.href}>{segment.label}</Breadcrumb.Link>
					{/if}
				{:else}
					{@const isLast = i === segments.length - 1}
					{#if isLast}
						<Breadcrumb.Page>{segment.label}</Breadcrumb.Page>
					{:else}
						<Breadcrumb.Link href={segment.href}>{segment.label}</Breadcrumb.Link>
					{/if}
				{/if}
			</Breadcrumb.Item>
		{/each}
	</Breadcrumb.List>
</Breadcrumb.Root>
