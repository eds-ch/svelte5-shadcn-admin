<script lang="ts">
	import { SvelteMap } from 'svelte/reactivity';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Kbd from '$lib/components/ui/kbd/index.js';
	import { getShortcuts } from '$lib/contexts/shortcuts.svelte.js';
	import { isMac } from '$lib/utils.js';
	import { m } from '$lib/paraglide/messages.js';

	const registry = getShortcuts();
	const mac = isMac();

	const grouped = $derived.by(() => {
		const groups = new SvelteMap<string, typeof registry.shortcuts>();
		for (const s of registry.shortcuts) {
			const list = groups.get(s.scope) ?? [];
			list.push(s);
			groups.set(s.scope, list);
		}
		return groups;
	});

	function formatKey(key: string): string {
		if (key === ' ') return 'Space';
		return key.length === 1 ? key.toUpperCase() : key;
	}

	function formatModifier(mod: string): string {
		switch (mod) {
			case 'ctrl':
				return mac ? '⌘' : 'Ctrl';
			case 'meta':
				return mac ? '⌘' : 'Ctrl';
			case 'shift':
				return mac ? '⇧' : 'Shift';
			case 'alt':
				return mac ? '⌥' : 'Alt';
			default:
				return mod;
		}
	}

	function scopeLabel(scope: string): string {
		if (scope === 'global') return m.shortcuts_global();
		return m.shortcuts_page();
	}
</script>

<Dialog.Root bind:open={registry.helpOpen}>
	<Dialog.Content class="max-w-md">
		<Dialog.Header>
			<Dialog.Title>{m.shortcuts_dialog_title()}</Dialog.Title>
		</Dialog.Header>
		<div class="max-h-[60vh] space-y-4 overflow-y-auto py-2">
			{#each [...grouped] as [scope, shortcuts] (scope)}
				<div>
					<h3 class="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
						{scopeLabel(scope)}
					</h3>
					<div class="space-y-1">
						{#each shortcuts as shortcut (shortcut.label)}
							<div class="flex items-center justify-between rounded-md px-2 py-1.5">
								<span class="text-sm">{shortcut.label}</span>
								<Kbd.Group>
									{#if shortcut.modifiers}
										{#each shortcut.modifiers as mod (mod)}
											<Kbd.Root>{formatModifier(mod)}</Kbd.Root>
										{/each}
									{/if}
									<Kbd.Root>{formatKey(shortcut.key)}</Kbd.Root>
								</Kbd.Group>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</Dialog.Content>
</Dialog.Root>
