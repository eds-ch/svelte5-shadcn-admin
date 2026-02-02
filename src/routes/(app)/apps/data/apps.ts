import type { Component } from 'svelte';
import { m } from '$lib/paraglide/messages.js';
import Telegram from '$lib/assets/brand-icons/telegram.svelte';
import Notion from '$lib/assets/brand-icons/notion.svelte';
import Figma from '$lib/assets/brand-icons/figma.svelte';
import Trello from '$lib/assets/brand-icons/trello.svelte';
import Slack from '$lib/assets/brand-icons/slack.svelte';
import Zoom from '$lib/assets/brand-icons/zoom.svelte';
import Stripe from '$lib/assets/brand-icons/stripe.svelte';
import Gmail from '$lib/assets/brand-icons/gmail.svelte';
import Medium from '$lib/assets/brand-icons/medium.svelte';
import Skype from '$lib/assets/brand-icons/skype.svelte';
import Docker from '$lib/assets/brand-icons/docker.svelte';
import GitHub from '$lib/assets/brand-icons/github.svelte';
import GitLab from '$lib/assets/brand-icons/gitlab.svelte';
import Discord from '$lib/assets/brand-icons/discord.svelte';
import WhatsApp from '$lib/assets/brand-icons/whatsapp.svelte';

export interface App {
	id: string;
	name: string;
	logo: Component<{ class?: string }>;
	connected: boolean;
	desc: string;
}

export function getApps(): App[] {
	return [
		{
			id: 'telegram',
			name: 'Telegram',
			logo: Telegram,
			connected: true,
			desc: m.apps_desc_telegram()
		},
		{
			id: 'notion',
			name: 'Notion',
			logo: Notion,
			connected: true,
			desc: m.apps_desc_notion()
		},
		{
			id: 'figma',
			name: 'Figma',
			logo: Figma,
			connected: false,
			desc: m.apps_desc_figma()
		},
		{
			id: 'trello',
			name: 'Trello',
			logo: Trello,
			connected: true,
			desc: m.apps_desc_trello()
		},
		{
			id: 'slack',
			name: 'Slack',
			logo: Slack,
			connected: true,
			desc: m.apps_desc_slack()
		},
		{
			id: 'zoom',
			name: 'Zoom',
			logo: Zoom,
			connected: false,
			desc: m.apps_desc_zoom()
		},
		{
			id: 'stripe',
			name: 'Stripe',
			logo: Stripe,
			connected: true,
			desc: m.apps_desc_stripe()
		},
		{
			id: 'gmail',
			name: 'Gmail',
			logo: Gmail,
			connected: true,
			desc: m.apps_desc_gmail()
		},
		{
			id: 'medium',
			name: 'Medium',
			logo: Medium,
			connected: false,
			desc: m.apps_desc_medium()
		},
		{
			id: 'skype',
			name: 'Skype',
			logo: Skype,
			connected: false,
			desc: m.apps_desc_skype()
		},
		{
			id: 'docker',
			name: 'Docker',
			logo: Docker,
			connected: true,
			desc: m.apps_desc_docker()
		},
		{
			id: 'github',
			name: 'GitHub',
			logo: GitHub,
			connected: true,
			desc: m.apps_desc_github()
		},
		{
			id: 'gitlab',
			name: 'GitLab',
			logo: GitLab,
			connected: false,
			desc: m.apps_desc_gitlab()
		},
		{
			id: 'discord',
			name: 'Discord',
			logo: Discord,
			connected: true,
			desc: m.apps_desc_discord()
		},
		{
			id: 'whatsapp',
			name: 'WhatsApp',
			logo: WhatsApp,
			connected: false,
			desc: m.apps_desc_whatsapp()
		}
	];
}
