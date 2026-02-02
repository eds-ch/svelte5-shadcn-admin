import type { LayoutLoad } from './$types';
import { currentUser, teams } from './data/current-user';

export const load: LayoutLoad = () => {
	return { currentUser, teams };
};
