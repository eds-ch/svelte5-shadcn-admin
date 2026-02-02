<script lang="ts">
	import AppHeader from '$lib/components/layout/app-header.svelte';
	import Main from '$lib/components/layout/main.svelte';
	import { page } from '$app/state';
	import { pushState, replaceState } from '$app/navigation';
	import { browser } from '$app/environment';
	import type { Snapshot } from './$types';
	import { m } from '$lib/paraglide/messages.js';
	import { pageTitle } from '$lib/config';
	import { pushDialogState, popDialogState, initDialogFromUrl } from '$lib/utils/shallow-dialog.js';
	import { createOptimisticList } from '$lib/utils/optimistic-list.svelte.js';
	import type { Task } from './data/schema.js';
	import type { TasksDialogType } from './context.js';
	import { setTasksContext } from './context.js';
	import TasksPrimaryButtons from './components/tasks-primary-buttons.svelte';
	import TasksTable from './components/tasks-table.svelte';
	import TasksDialogs from './components/tasks-dialogs.svelte';
	import ErrorFallback from '$lib/components/shared/error-fallback.svelte';
	import { getShortcuts } from '$lib/contexts/shortcuts.svelte.js';

	let { data } = $props();
	let dialogOpen = $state<TasksDialogType | null>(null);
	let currentRow = $state<Task | null>(null);
	// svelte-ignore state_referenced_locally
	let serverTasks = $state<Task[]>([...data.tasks]);
	const taskList = createOptimisticList(() => serverTasks);

	const initialSearch = page.url.searchParams.get('search') ?? '';
	const initialStatus = (() => {
		const val = page.url.searchParams.get('status');
		return val ? val.split(',') : [];
	})();
	const initialPriority = (() => {
		const val = page.url.searchParams.get('priority');
		return val ? val.split(',') : [];
	})();
	const initialSort = (() => {
		const val = page.url.searchParams.get('sort');
		if (!val) return [];
		const [id, dir] = val.split('.');
		return [{ id, desc: dir === 'desc' }];
	})();
	const initialPage = (() => {
		const val = page.url.searchParams.get('page');
		return val ? parseInt(val, 10) - 1 : 0;
	})();
	const initialPageSize = (() => {
		const val = page.url.searchParams.get('per_page');
		return val ? parseInt(val, 10) : 10;
	})();

	// Shallow routing for dialogs
	const HISTORY_DIALOGS: TasksDialogType[] = ['create', 'update'];
	const DIALOG_CLEANUP_DELAY = 500;
	let _closingViaHistory = false;

	function openDialog(type: TasksDialogType, row?: Task) {
		if (HISTORY_DIALOGS.includes(type)) {
			currentRow = row ?? null;
			dialogOpen = type;
			const params: Record<string, string> = {};
			if (type === 'update' && row) {
				params.edit = row.id;
			} else if (type === 'create') {
				params.create = '';
			}
			pushDialogState(
				page.url,
				{ taskDialog: { type: type as 'create' | 'update', row: row ?? null } },
				params
			);
		} else {
			currentRow = row ?? null;
			dialogOpen = type;
		}
	}

	function closeDialog() {
		const wasHistory = dialogOpen !== null && HISTORY_DIALOGS.includes(dialogOpen);
		dialogOpen = null;
		setTimeout(() => {
			currentRow = null;
		}, DIALOG_CLEANUP_DELAY);
		if (wasHistory) {
			_closingViaHistory = true;
			popDialogState();
		}
	}

	// Sync history state → local state (handles back/forward browser buttons)
	$effect(() => {
		const taskDialog = page.state.taskDialog;
		if (taskDialog) {
			if (_closingViaHistory) return;
			dialogOpen = taskDialog.type;
			currentRow = taskDialog.row;
		} else {
			_closingViaHistory = false;
			if (dialogOpen && HISTORY_DIALOGS.includes(dialogOpen)) {
				dialogOpen = null;
				setTimeout(() => {
					currentRow = null;
				}, DIALOG_CLEANUP_DELAY);
			}
		}
	});

	// Direct URL visit: open dialog from URL search params
	if (browser) {
		const editId = page.url.searchParams.get('edit');
		const hasCreate = page.url.searchParams.has('create');

		if (editId) {
			const task = taskList.map.get(editId);
			if (task) {
				dialogOpen = 'update';
				currentRow = task;
				initDialogFromUrl(page.url, { taskDialog: { type: 'update', row: task } }, ['edit']);
			} else {
				replaceState(page.url.pathname, {});
			}
		} else if (hasCreate) {
			dialogOpen = 'create';
			initDialogFromUrl(page.url, { taskDialog: { type: 'create', row: null } }, ['create']);
		}
	}

	setTasksContext({
		get open() {
			return dialogOpen;
		},
		set open(v) {
			dialogOpen = v;
		},
		get currentRow() {
			return currentRow;
		},
		set currentRow(v) {
			currentRow = v;
		},
		get tasks() {
			return taskList.items;
		},
		set tasks(v) {
			taskList.items = v;
		},
		get tasksMap() {
			return taskList.map;
		},
		openDialog,
		closeDialog,
		apply: (...args: Parameters<typeof taskList.apply>) => taskList.apply(...args)
	});

	const shortcutRegistry = getShortcuts();
	$effect(() => {
		return shortcutRegistry.register([
			{
				key: 'n',
				label: m.shortcut_new_task(),
				action: () => openDialog('create'),
				scope: 'tasks'
			}
		]);
	});

	export const snapshot: Snapshot<{
		dialogType: TasksDialogType | null;
		currentRowId: string | null;
	}> = {
		capture: () => ({
			dialogType: dialogOpen,
			currentRowId: currentRow?.id ?? null
		}),
		restore: (value) => {
			if (value.dialogType && HISTORY_DIALOGS.includes(value.dialogType)) {
				const row = value.currentRowId ? (taskList.map.get(value.currentRowId) ?? null) : null;
				if (value.dialogType === 'update' && !row) return;
				const url = new URL(page.url);
				if (value.dialogType === 'update' && row) {
					url.searchParams.set('edit', row.id);
				} else if (value.dialogType === 'create') {
					url.searchParams.set('create', '');
				}
				pushState(url, {
					taskDialog: { type: value.dialogType as 'create' | 'update', row }
				});
			}
		}
	};
</script>

<svelte:head>
	<title>{pageTitle(m.tasks_title())}</title>
</svelte:head>

<AppHeader />

<Main class="gap-4 sm:gap-6">
	<div class="flex flex-wrap items-end justify-between gap-2">
		<div>
			<h1 class="text-2xl font-bold tracking-tight">{m.tasks_title()}</h1>
			<p class="text-muted-foreground">
				{m.tasks_subtitle()}
			</p>
		</div>
		<TasksPrimaryButtons />
	</div>
	<TasksTable
		data={taskList.items}
		{initialSearch}
		{initialStatus}
		{initialPriority}
		{initialSort}
		{initialPage}
		{initialPageSize}
	/>
</Main>

<svelte:boundary onerror={(e) => console.error('[TasksDialogs]', e)}>
	<TasksDialogs />
	{#snippet failed(error, reset)}
		<ErrorFallback {error} {reset} />
	{/snippet}
</svelte:boundary>
