import { SvelteMap } from 'svelte/reactivity';

/**
 * Overridable `$derived` (Svelte 5.25+): `items` re-derives from `getServerData()`
 * when server data changes, but can be temporarily overridden for optimistic UI.
 * On error, resetting to `getServerData()` forces re-derivation (automatic revert).
 */
export function createOptimisticList<T extends { id: string }>(getServerData: () => T[]) {
	let items = $derived(getServerData());
	const map = $derived(new SvelteMap(items.map((t) => [t.id, t] as const)));

	return {
		get items() {
			return items;
		},
		set items(v: T[]) {
			items = v;
		},
		get map() {
			return map;
		},
		async apply(updater: (current: T[]) => T[], action: () => Promise<unknown>) {
			items = updater(items);
			try {
				await action();
			} catch (e) {
				items = getServerData();
				throw e;
			}
		}
	};
}
