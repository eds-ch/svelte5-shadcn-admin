import { pushState, replaceState } from '$app/navigation';

/** Push a dialog state as a new history entry. Preserves existing search params. */
export function pushDialogState(
	currentUrl: URL,
	state: App.PageState,
	dialogParams: Record<string, string>
): void {
	const url = new URL(currentUrl);
	for (const [key, value] of Object.entries(dialogParams)) {
		url.searchParams.set(key, value);
	}
	pushState(url, state);
}

/** Close a history-driven dialog by navigating back. */
export function popDialogState(): void {
	history.back();
}

/**
 * Open a dialog from URL params on direct page visit.
 * Inserts a clean base entry so back-button returns to the page without the dialog.
 */
export function initDialogFromUrl(
	currentUrl: URL,
	state: App.PageState,
	dialogParamKeys: string[]
): void {
	const cleanUrl = new URL(currentUrl);
	for (const key of dialogParamKeys) {
		cleanUrl.searchParams.delete(key);
	}
	replaceState(cleanUrl, {});
	pushState(currentUrl, state);
}
