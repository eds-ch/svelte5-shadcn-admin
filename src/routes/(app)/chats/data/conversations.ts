import { getAvatarUrl } from '$lib/utils/avatar';
import type { ChatUser } from './types';

export const chatUsers: ChatUser[] = [
	{
		id: 1,
		avatar: getAvatarUrl('nadia-torres'),
		fullName: 'Nadia Torres',
		username: 'nadia_ops',
		title: 'DevOps Lead',
		email: 'nadia.torres@example.com',
		role: 'Engineering',
		onlineStatus: true,
		messages: [
			{
				sender: 'You',
				message: 'Perfect, I will keep an eye on the alerts channel.',
				timestamp: '2025-01-17T11:20:00'
			},
			{
				sender: 'Nadia',
				message:
					'Deploy is rolling out now. Canary looks healthy so far, full rollout in 15 minutes.',
				timestamp: '2025-01-17T11:18:00'
			},
			{
				sender: 'You',
				message: 'Are we still on track for the production deploy this morning?',
				timestamp: '2025-01-17T11:15:00'
			},
			{
				sender: 'Nadia',
				message:
					'Staging passed all smoke tests. I bumped the resource limits on the ingestion pods too.',
				timestamp: '2025-01-16T16:40:00'
			},
			{
				sender: 'You',
				message: 'Nice work. How did the staging run go yesterday?',
				timestamp: '2025-01-16T16:35:00'
			}
		]
	},
	{
		id: 2,
		avatar: getAvatarUrl('sam-lawson'),
		fullName: 'Sam Lawson',
		username: 'sam_eng',
		title: 'Backend Engineer',
		email: 'sam.lawson@example.com',
		role: 'Engineering',
		onlineStatus: true,
		messages: [
			{
				sender: 'Sam',
				message:
					'Done. The batch endpoint now processes 10k events per second. Benchmark results are in the PR description.',
				timestamp: '2025-01-17T09:45:00'
			},
			{
				sender: 'You',
				message: 'Can you add the throughput numbers to the PR before I review?',
				timestamp: '2025-01-17T09:42:00'
			},
			{
				sender: 'Sam',
				message:
					'Hey, just pushed the event aggregation refactor. Reduced query time from 800ms to 120ms.',
				timestamp: '2025-01-17T09:38:00'
			}
		]
	},
	{
		id: 3,
		avatar: getAvatarUrl('yuki-tanaka'),
		fullName: 'Yuki Tanaka',
		username: 'yuki_qa',
		title: 'QA Specialist',
		email: 'yuki.tanaka@example.com',
		role: 'Quality',
		onlineStatus: false,
		messages: [
			{
				sender: 'You',
				message: 'Great catch. I will flag it for the next sprint.',
				timestamp: '2025-01-16T15:30:00'
			},
			{
				sender: 'Yuki',
				message:
					'Found a regression in the funnel chart: date range picker resets when switching between tabs.',
				timestamp: '2025-01-16T15:25:00'
			},
			{
				sender: 'You',
				message: 'How is the regression suite looking after the chart overhaul?',
				timestamp: '2025-01-16T15:20:00'
			},
			{
				sender: 'Yuki',
				message:
					'All green on the main flows. I am running edge cases now and will have the full report by end of day.',
				timestamp: '2025-01-16T15:18:00'
			}
		]
	},
	{
		id: 4,
		avatar: getAvatarUrl('omar-hadid'),
		fullName: 'Omar Hadid',
		username: 'omar_design',
		title: 'UI/UX Lead',
		email: 'omar.hadid@example.com',
		role: 'Design',
		onlineStatus: true,
		messages: [
			{
				sender: 'Omar',
				message:
					'Updated the Figma with the new dashboard card layout. Three variants: compact, standard, and expanded.',
				timestamp: '2025-01-17T10:15:00'
			},
			{
				sender: 'You',
				message: 'Those look great. I especially like the compact variant for mobile.',
				timestamp: '2025-01-17T10:20:00'
			},
			{
				sender: 'Omar',
				message:
					'Thanks! I also added the dark mode tokens. Should map cleanly to the existing OkLCH variables.',
				timestamp: '2025-01-17T10:25:00'
			}
		]
	},
	{
		id: 5,
		avatar: getAvatarUrl('elena-voss'),
		fullName: 'Elena Voss',
		username: 'elena_data',
		title: 'Data Analyst',
		email: 'elena.voss@example.com',
		role: 'Analytics',
		onlineStatus: false,
		messages: [
			{
				sender: 'You',
				message: 'That is a solid insight. Can you put together a slide for the Monday review?',
				timestamp: '2025-01-16T14:10:00'
			},
			{
				sender: 'Elena',
				message:
					'Sure, I will have it ready. Also, the retention cohort data shows a 12% uplift since we launched the onboarding flow.',
				timestamp: '2025-01-16T14:05:00'
			},
			{
				sender: 'You',
				message: 'Hey Elena, did you get a chance to look at the Q4 conversion numbers?',
				timestamp: '2025-01-16T14:00:00'
			},
			{
				sender: 'Elena',
				message:
					'Yes! Conversion is up 8% month-over-month. The new checkout funnel is performing way better than the old one.',
				timestamp: '2025-01-16T13:55:00'
			}
		]
	},
	{
		id: 6,
		avatar: getAvatarUrl('kai-bennett'),
		fullName: 'Kai Bennett',
		username: 'kai_front',
		title: 'Frontend Dev',
		email: 'kai.bennett@example.com',
		role: 'Engineering',
		onlineStatus: true,
		messages: [
			{
				sender: 'Kai',
				message:
					'Just finished wiring up the real-time chart component. It streams data over SSE now instead of polling.',
				timestamp: '2025-01-17T13:50:00'
			},
			{
				sender: 'You',
				message: 'Nice, that should cut down on unnecessary requests. What is the update interval?',
				timestamp: '2025-01-17T13:55:00'
			},
			{
				sender: 'Kai',
				message:
					'Every 5 seconds for the live view, 30 seconds for the overview. Both configurable via the settings panel.',
				timestamp: '2025-01-17T14:00:00'
			},
			{
				sender: 'You',
				message: 'Perfect. I will test it against the staging API this afternoon.',
				timestamp: '2025-01-17T14:05:00'
			}
		]
	},
	{
		id: 7,
		avatar: getAvatarUrl('ava-mitchell'),
		fullName: 'Ava Mitchell',
		username: 'ava_pm',
		title: 'Product Manager',
		email: 'ava.mitchell@example.com',
		role: 'Product',
		onlineStatus: false,
		messages: [
			{
				sender: 'Ava',
				message:
					'Quick update: the stakeholder demo moved to Thursday. Can you make sure the dashboard filters are working by then?',
				timestamp: '2025-01-15T16:30:00'
			},
			{
				sender: 'You',
				message: 'Thursday works. Filters and export are both on track.',
				timestamp: '2025-01-15T16:35:00'
			},
			{
				sender: 'Ava',
				message:
					'Awesome. Also, the client asked about adding a CSV export to the analytics page. Can we scope that?',
				timestamp: '2025-01-15T16:40:00'
			},
			{
				sender: 'You',
				message:
					'Already on the backlog. I think it is a two-day task if we reuse the existing table serializer.',
				timestamp: '2025-01-15T16:45:00'
			},
			{
				sender: 'Ava',
				message: 'Great, I will add it to the sprint. Thanks!',
				timestamp: '2025-01-15T16:50:00'
			}
		]
	},
	{
		id: 8,
		avatar: getAvatarUrl('diego-reyes'),
		fullName: 'Diego Reyes',
		username: 'diego_infra',
		title: 'Infrastructure Engineer',
		email: 'diego.reyes@example.com',
		role: 'Engineering',
		onlineStatus: true,
		messages: [
			{
				sender: 'Diego',
				message:
					'Heads up: I am migrating the analytics DB to the new cluster tonight. There will be a 5-minute read-only window around 2 AM.',
				timestamp: '2025-01-16T18:00:00'
			},
			{
				sender: 'You',
				message: 'Thanks for the notice. I will add a maintenance banner just in case.',
				timestamp: '2025-01-16T18:05:00'
			},
			{
				sender: 'Diego',
				message:
					'Good idea. The new cluster should give us 3x read throughput, so the dashboard queries will be noticeably faster.',
				timestamp: '2025-01-16T18:10:00'
			}
		]
	},
	{
		id: 9,
		avatar: getAvatarUrl('lin-zhang'),
		fullName: 'Lin Zhang',
		username: 'lin_ml',
		title: 'ML Engineer',
		email: 'lin.zhang@example.com',
		role: 'Engineering',
		onlineStatus: false,
		messages: [
			{
				sender: 'You',
				message: 'How is the anomaly detection model coming along?',
				timestamp: '2025-01-15T10:00:00'
			},
			{
				sender: 'Lin',
				message:
					'Training finished overnight. Precision is at 94% on the validation set. I am writing the integration endpoint now.',
				timestamp: '2025-01-15T10:05:00'
			},
			{
				sender: 'You',
				message:
					'That is excellent. Once the endpoint is ready, I will hook it into the alerts widget on the dashboard.',
				timestamp: '2025-01-15T10:10:00'
			},
			{
				sender: 'Lin',
				message:
					'Should be done by tomorrow. I will send you the API spec so you can start on the frontend in parallel.',
				timestamp: '2025-01-15T10:15:00'
			}
		]
	},
	{
		id: 10,
		avatar: getAvatarUrl('sophie-ward'),
		fullName: 'Sophie Ward',
		username: 'sophie_cto',
		title: 'CTO',
		email: 'sophie.ward@example.com',
		role: 'Executive',
		onlineStatus: true,
		messages: [
			{
				sender: 'Sophie',
				message:
					'Great progress on the analytics rewrite. The board was impressed with the demo last week.',
				timestamp: '2025-01-17T08:30:00'
			},
			{
				sender: 'You',
				message: 'Thanks, Sophie! The team has been putting in solid work.',
				timestamp: '2025-01-17T08:35:00'
			},
			{
				sender: 'Sophie',
				message:
					'I want to discuss the roadmap for Q2. Can we block out an hour next Tuesday to go over priorities?',
				timestamp: '2025-01-17T08:40:00'
			},
			{
				sender: 'You',
				message: 'Absolutely. I will send a calendar invite this afternoon.',
				timestamp: '2025-01-17T08:45:00'
			},
			{
				sender: 'Sophie',
				message: 'Perfect. Also loop in Ava so we can align product and engineering goals.',
				timestamp: '2025-01-17T08:50:00'
			}
		]
	}
];
