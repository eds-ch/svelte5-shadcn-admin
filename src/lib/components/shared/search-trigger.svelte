<script lang="ts">
	import Search from '@lucide/svelte/icons/search';
	import { cn, isMac } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import { m } from '$lib/paraglide/messages.js';
	import { getSearch } from '$lib/contexts/search.svelte';
	import { tooltip } from '$lib/attachments/tooltip';

	let { class: className }: { class?: string } = $props();

	const search = getSearch();
	const modifierKey = $derived(isMac() ? '\u2318' : 'Ctrl');
</script>

<Button
	{@attach tooltip(m.search_tooltip({ modifier: modifierKey }))}
	variant="outline"
	class={cn(
		'group bg-muted/25 text-muted-foreground hover:bg-accent relative h-8 w-full flex-1 justify-start rounded-md text-sm font-normal shadow-none sm:w-40 sm:pe-12 md:flex-none lg:w-52 xl:w-64',
		className
	)}
	onclick={() => search.toggle()}
>
	<Search aria-hidden="true" class="absolute start-1.5 top-1/2 -translate-y-1/2" size={16} />
	<span class="ms-4">{m.search_label()}</span>
	<kbd
		class="bg-muted group-hover:bg-accent pointer-events-none absolute end-[0.3rem] top-[0.3rem] hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex"
	>
		<span class="text-xs">{modifierKey}</span>K
	</kbd>
</Button>
