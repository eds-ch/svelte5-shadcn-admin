import { untrack } from 'svelte';
import { SvelteURL, SvelteURLSearchParams } from 'svelte/reactivity';
import { afterNavigate, replaceState } from '$app/navigation';
import { page } from '$app/state';

/**
 * Reactive reads: `params.get('key')` inside `$derived` or templates will track changes.
 * Writes: call `update()` to modify params and sync to the browser URL.
 *
 * Must be called during component init (needs lifecycle context for afterNavigate).
 */
export function createFilterSync() {
	const params = new SvelteURLSearchParams(page.url.searchParams);

	// Track router readiness — replaceState throws if called before router init (during hydration).
	let routerReady = false;
	afterNavigate(() => {
		routerReady = true;
	});

	/**
	 * untrack prevents reactive loops; replaceState (not goto) avoids load re-runs.
	 */
	function update(entries: Record<string, string | null>) {
		untrack(() => {
			for (const [key, value] of Object.entries(entries)) {
				if (value === null || value === '') {
					params.delete(key);
				} else {
					params.set(key, value);
				}
			}

			if (!routerReady) return;

			const url = new SvelteURL(page.url);
			for (const [key, value] of Object.entries(entries)) {
				if (value === null || value === '') {
					url.searchParams.delete(key);
				} else {
					url.searchParams.set(key, value);
				}
			}
			replaceState(url, page.state);
		});
	}

	/** Parse a comma-separated URL param into a string array */
	function getList(key: string): string[] {
		const val = params.get(key);
		return val ? val.split(',') : [];
	}

	return { params, update, getList };
}
