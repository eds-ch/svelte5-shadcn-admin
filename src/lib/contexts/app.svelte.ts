import { createContext } from 'svelte';
import type { User, Team } from '$lib/data/types';

export type AppData = {
	currentUser: User;
	teams: Team[];
};

export const [getAppData, setAppData] = createContext<AppData>();
