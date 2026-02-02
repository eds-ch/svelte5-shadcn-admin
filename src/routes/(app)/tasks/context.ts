import { createContext } from 'svelte';
import type { SvelteMap } from 'svelte/reactivity';
import type { Task } from './data/schema.js';

export type TasksDialogType = 'create' | 'update' | 'delete' | 'import';

export type TasksContext = {
	open: TasksDialogType | null;
	currentRow: Task | null;
	tasks: Task[];
	tasksMap: SvelteMap<string, Task>;
	openDialog: (type: TasksDialogType, row?: Task) => void;
	closeDialog: () => void;
	apply: (updater: (items: Task[]) => Task[], action: () => Promise<unknown>) => Promise<void>;
};

export const [getTasksContext, setTasksContext] = createContext<TasksContext>();
