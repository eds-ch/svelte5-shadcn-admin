import type { PageLoad } from './$types';
import { users } from './data/users';

export const load: PageLoad = () => {
	return { users: structuredClone(users) };
};
