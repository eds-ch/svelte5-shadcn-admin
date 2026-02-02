import type { PageLoad } from './$types';
import {
	getOverviewMetrics,
	getAnalyticsMetrics,
	recentSales,
	salesCount,
	getOverviewChartData,
	getAnalyticsChartData,
	getReferrers,
	getDevices
} from './data/dashboard';

export const load: PageLoad = () => {
	return {
		overviewMetrics: getOverviewMetrics(),
		analyticsMetrics: getAnalyticsMetrics(),
		recentSales,
		salesCount,
		overviewChartData: getOverviewChartData(),
		analyticsChartData: getAnalyticsChartData(),
		referrers: getReferrers(),
		devices: getDevices()
	};
};
