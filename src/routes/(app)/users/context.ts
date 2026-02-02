import { createContext } from 'svelte';
import type { SvelteMap } from 'svelte/reactivity';
import type { User } from './data/schema.js';

export type UsersDialogType = 'add' | 'edit' | 'delete' | 'invite';

export type UsersContext = {
	open: UsersDialogType | null;
	currentRow: User | null;
	users: User[];
	usersMap: SvelteMap<string, User>;
	openDialog: (type: UsersDialogType, row?: User) => void;
	closeDialog: () => void;
	apply: (updater: (items: User[]) => User[], action: () => Promise<unknown>) => Promise<void>;
};

export const [getUsersContext, setUsersContext] = createContext<UsersContext>();
