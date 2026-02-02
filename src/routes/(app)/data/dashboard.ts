import { m } from '$lib/paraglide/messages.js';
import { getLocale } from '$lib/paraglide/runtime.js';
import { getAvatarUrl } from '$lib/utils/avatar';

export type MetricValueFormat = 'currency' | 'number' | 'number-plus' | 'percent' | 'duration';

export type MetricCard = {
	title: string;
	value: string;
	numericValue: number;
	valueFormat: MetricValueFormat;
	change: string;
	icon: string;
};

export type Sale = {
	name: string;
	email: string;
	avatar: string;
	amount: string;
};

export type ChartPoint = { name: string; total: number };
export type AnalyticsPoint = { name: string; clicks: number; uniques: number };
export type BarListItem = { name: string; value: number };

export function getOverviewMetrics(): MetricCard[] {
	return [
		{
			title: m.dash_metric_monthly_revenue(),
			value: '$62,340.50',
			numericValue: 62340.5,
			valueFormat: 'currency',
			change: m.dash_change_from_last_month({ change: '+14.2%' }),
			icon: 'dollar-sign'
		},
		{
			title: m.dash_metric_active_accounts(),
			value: '3,180',
			numericValue: 3180,
			valueFormat: 'number',
			change: m.dash_change_from_last_month({ change: '+8.7%' }),
			icon: 'users'
		},
		{
			title: m.dash_metric_new_signups(),
			value: '+842',
			numericValue: 842,
			valueFormat: 'number-plus',
			change: m.dash_change_from_last_month({ change: '+23.4%' }),
			icon: 'credit-card'
		},
		{
			title: m.dash_metric_active_now(),
			value: '412',
			numericValue: 412,
			valueFormat: 'number',
			change: m.dash_change_since_last_hour({ change: '+38' }),
			icon: 'activity'
		}
	];
}

export function getAnalyticsMetrics(): MetricCard[] {
	return [
		{
			title: m.dash_metric_total_clicks(),
			value: '2,156',
			numericValue: 2156,
			valueFormat: 'number',
			change: m.dash_change_vs_last_week({ change: '+9.1%' }),
			icon: 'mouse-pointer-click'
		},
		{
			title: m.dash_metric_unique_visitors(),
			value: '1,403',
			numericValue: 1403,
			valueFormat: 'number',
			change: m.dash_change_vs_last_week({ change: '+11.3%' }),
			icon: 'user-check'
		},
		{
			title: m.dash_metric_bounce_rate(),
			value: '37%',
			numericValue: 37,
			valueFormat: 'percent',
			change: m.dash_change_vs_last_week({ change: '-4.8%' }),
			icon: 'trending-down'
		},
		{
			title: m.dash_metric_avg_session(),
			value: '4m 12s',
			numericValue: 252,
			valueFormat: 'duration',
			change: m.dash_change_vs_last_week({ change: '+26s' }),
			icon: 'target'
		}
	];
}

// Not localized
export const recentSales: Sale[] = [
	{
		name: 'Lena Park',
		email: 'lena.park@example.com',
		avatar: getAvatarUrl('Lena Park'),
		amount: '+$2,450.00'
	},
	{
		name: 'Marco Chen',
		email: 'marco.chen@example.com',
		avatar: getAvatarUrl('Marco Chen'),
		amount: '+$149.00'
	},
	{
		name: 'Anya Kowalski',
		email: 'anya.k@example.com',
		avatar: getAvatarUrl('Anya Kowalski'),
		amount: '+$580.00'
	},
	{
		name: 'James Osei',
		email: 'j.osei@example.com',
		avatar: getAvatarUrl('James Osei'),
		amount: '+$72.00'
	},
	{
		name: 'Priya Mehta',
		email: 'priya.m@example.com',
		avatar: getAvatarUrl('Priya Mehta'),
		amount: '+$1,200.00'
	}
];

export const salesCount = 312;

export function getOverviewChartData(): ChartPoint[] {
	const locale = getLocale();
	const fmt = new Intl.DateTimeFormat(locale, { month: 'short' });
	const totals = [5800, 4100, 6300, 5500, 4700, 7200, 5400, 6800, 7100, 5900, 8200, 6400];
	return totals.map((total, i) => ({
		name: fmt.format(new Date(2024, i, 1)),
		total
	}));
}

export function getAnalyticsChartData(): AnalyticsPoint[] {
	const locale = getLocale();
	const fmt = new Intl.DateTimeFormat(locale, { weekday: 'short' });
	const traffic = [
		{ clicks: 582, uniques: 398 },
		{ clicks: 741, uniques: 502 },
		{ clicks: 629, uniques: 434 },
		{ clicks: 894, uniques: 615 },
		{ clicks: 453, uniques: 298 },
		{ clicks: 312, uniques: 221 },
		{ clicks: 367, uniques: 256 }
	];
	// Jan 1, 2024 is Monday
	return traffic.map((d, i) => ({
		name: fmt.format(new Date(2024, 0, 1 + i)),
		...d
	}));
}

export function getReferrers(): BarListItem[] {
	return [
		{ name: 'Google', value: 634 },
		{ name: m.dash_referrer_direct(), value: 421 },
		{ name: 'GitHub', value: 289 },
		{ name: m.dash_referrer_newsletter(), value: 176 }
	];
}

export function getDevices(): BarListItem[] {
	return [
		{ name: m.dash_device_desktop(), value: 68 },
		{ name: m.dash_device_mobile(), value: 27 },
		{ name: m.dash_device_tablet(), value: 5 }
	];
}
