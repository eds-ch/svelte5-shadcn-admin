import type { PageLoad } from './$types';
import { getApps } from './data/apps';

export const load: PageLoad = () => {
	return { apps: getApps() };
};
