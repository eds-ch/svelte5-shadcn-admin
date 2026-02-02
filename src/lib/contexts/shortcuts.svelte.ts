import { createContext, untrack } from 'svelte';
import { SvelteSet } from 'svelte/reactivity';

export interface Shortcut {
	key: string;
	modifiers?: ('ctrl' | 'meta' | 'shift' | 'alt')[];
	label: string;
	action: () => void;
	scope: string;
	enabled?: () => boolean;
}

const INPUT_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

export class ShortcutRegistry {
	shortcuts: Shortcut[] = $state([]);
	helpOpen: boolean = $state(false);

	register(newShortcuts: Shortcut[]): () => void {
		this.shortcuts = [...untrack(() => this.shortcuts), ...newShortcuts];
		return () => {
			const toRemove = new SvelteSet(newShortcuts);
			this.shortcuts = untrack(() => this.shortcuts).filter((s) => !toRemove.has(s));
		};
	}

	handleKeydown = (event: KeyboardEvent) => {
		const target = event.target as HTMLElement;
		const isInput = INPUT_TAGS.has(target.tagName) || target.isContentEditable;

		for (const shortcut of this.shortcuts) {
			const hasModifiers = shortcut.modifiers && shortcut.modifiers.length > 0;

			// Skip non-modifier shortcuts when typing in inputs
			if (isInput && !hasModifiers) continue;

			// Check key match
			if (event.key.toLowerCase() !== shortcut.key.toLowerCase()) continue;

			// Check modifiers
			const needCtrl = shortcut.modifiers?.includes('ctrl') ?? false;
			const needMeta = shortcut.modifiers?.includes('meta') ?? false;
			const needShift = shortcut.modifiers?.includes('shift') ?? false;
			const needAlt = shortcut.modifiers?.includes('alt') ?? false;

			// For ctrl/meta, accept either (cross-platform Cmd+K / Ctrl+K)
			const needCmdOrCtrl = needCtrl || needMeta;
			const hasCmdOrCtrl = event.metaKey || event.ctrlKey;

			if (needCmdOrCtrl && !hasCmdOrCtrl) continue;
			if (!needCmdOrCtrl && (event.metaKey || event.ctrlKey)) continue;
			if (needShift !== event.shiftKey) continue;
			if (needAlt !== event.altKey) continue;

			// Check enabled guard
			if (shortcut.enabled && !shortcut.enabled()) continue;

			event.preventDefault();
			shortcut.action();
			return;
		}
	};
}

export const [getShortcuts, setShortcuts] = createContext<ShortcutRegistry>();
