import type { PageLoad } from './$types';
import { tasks } from './data/tasks';

export const load: PageLoad = () => {
	return { tasks: structuredClone(tasks) };
};
