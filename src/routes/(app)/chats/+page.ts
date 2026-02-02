import type { PageLoad } from './$types';
import { chatUsers } from './data/conversations';

export const load: PageLoad = () => {
	return { chatUsers: structuredClone(chatUsers) };
};
