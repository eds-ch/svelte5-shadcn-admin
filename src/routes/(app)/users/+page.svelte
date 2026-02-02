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
	import type { User } from './data/schema.js';
	import { type UsersDialogType, setUsersContext } from './context.js';
	import UsersTable from './components/users-table.svelte';
	import UsersPrimaryButtons from './components/users-primary-buttons.svelte';
	import UsersDialogs from './components/users-dialogs.svelte';
	import ErrorFallback from '$lib/components/shared/error-fallback.svelte';
	import { getShortcuts } from '$lib/contexts/shortcuts.svelte.js';

	let { data } = $props();
	let dialogOpen = $state<UsersDialogType | null>(null);
	let currentRow = $state<User | null>(null);
	// svelte-ignore state_referenced_locally
	let serverUsers = $state<User[]>([...data.users]);
	const userList = createOptimisticList(() => serverUsers);

	const initialSearch = page.url.searchParams.get('search') ?? '';
	const initialStatus = (() => {
		const val = page.url.searchParams.get('status');
		return val ? val.split(',') : [];
	})();
	const initialRole = (() => {
		const val = page.url.searchParams.get('role');
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
	const HISTORY_DIALOGS: UsersDialogType[] = ['add', 'edit', 'invite'];
	const DIALOG_CLEANUP_DELAY = 500;
	let _closingViaHistory = false;

	function openDialog(type: UsersDialogType, row?: User) {
		if (HISTORY_DIALOGS.includes(type)) {
			currentRow = row ?? null;
			dialogOpen = type;
			const params: Record<string, string> = {};
			if (type === 'edit' && row) {
				params.edit = row.id;
			} else if (type === 'add') {
				params.add = '';
			} else if (type === 'invite') {
				params.invite = '';
			}
			pushDialogState(
				page.url,
				{
					userDialog: {
						type: type as 'add' | 'edit' | 'invite',
						row: row ? ($state.snapshot(row) as User) : null
					}
				},
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
		const userDialog = page.state.userDialog;
		if (userDialog) {
			if (_closingViaHistory) return;
			dialogOpen = userDialog.type;
			currentRow = userDialog.row;
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
		const hasAdd = page.url.searchParams.has('add');
		const hasInvite = page.url.searchParams.has('invite');

		if (editId) {
			const user = userList.map.get(editId);
			if (user) {
				dialogOpen = 'edit';
				currentRow = user;
				initDialogFromUrl(
					page.url,
					{ userDialog: { type: 'edit', row: $state.snapshot(user) as User } },
					['edit']
				);
			} else {
				replaceState(page.url.pathname, {});
			}
		} else if (hasAdd) {
			dialogOpen = 'add';
			initDialogFromUrl(page.url, { userDialog: { type: 'add', row: null } }, ['add']);
		} else if (hasInvite) {
			dialogOpen = 'invite';
			initDialogFromUrl(page.url, { userDialog: { type: 'invite', row: null } }, ['invite']);
		}
	}

	setUsersContext({
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
		get users() {
			return userList.items;
		},
		set users(v) {
			userList.items = v;
		},
		get usersMap() {
			return userList.map;
		},
		openDialog,
		closeDialog,
		apply: (...args: Parameters<typeof userList.apply>) => userList.apply(...args)
	});

	const shortcutRegistry = getShortcuts();
	$effect(() => {
		return shortcutRegistry.register([
			{
				key: 'n',
				label: m.shortcut_new_user(),
				action: () => openDialog('add'),
				scope: 'users'
			},
			{
				key: 'i',
				label: m.shortcut_invite_user(),
				action: () => openDialog('invite'),
				scope: 'users'
			}
		]);
	});

	export const snapshot: Snapshot<{
		dialogType: UsersDialogType | null;
		currentRowId: string | null;
	}> = {
		capture: () => ({
			dialogType: dialogOpen,
			currentRowId: currentRow?.id ?? null
		}),
		restore: (value) => {
			if (value.dialogType && HISTORY_DIALOGS.includes(value.dialogType)) {
				const row = value.currentRowId ? (userList.map.get(value.currentRowId) ?? null) : null;
				if (value.dialogType === 'edit' && !row) return;
				const url = new URL(page.url);
				if (value.dialogType === 'edit' && row) {
					url.searchParams.set('edit', row.id);
				} else if (value.dialogType === 'add') {
					url.searchParams.set('add', '');
				} else if (value.dialogType === 'invite') {
					url.searchParams.set('invite', '');
				}
				pushState(url, {
					userDialog: {
						type: value.dialogType as 'add' | 'edit' | 'invite',
						row: row ? ($state.snapshot(row) as User) : null
					}
				});
			}
		}
	};
</script>

<svelte:head>
	<title>{pageTitle(m.users_title())}</title>
</svelte:head>

<AppHeader />

<Main class="gap-2">
	<div class="mb-2 flex flex-wrap items-end justify-between gap-2">
		<div>
			<h1 class="text-2xl font-bold tracking-tight">{m.users_title()}</h1>
			<p class="text-muted-foreground">{m.users_subtitle()}</p>
		</div>
		<UsersPrimaryButtons />
	</div>
	<UsersTable
		data={userList.items}
		{initialSearch}
		{initialStatus}
		{initialRole}
		{initialSort}
		{initialPage}
		{initialPageSize}
	/>
</Main>

<svelte:boundary onerror={(e) => console.error('[UsersDialogs]', e)}>
	<UsersDialogs />
	{#snippet failed(error, reset)}
		<ErrorFallback {error} {reset} />
	{/snippet}
</svelte:boundary>
