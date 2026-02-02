<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { localizeHref } from '$lib/paraglide/runtime.js';
	import { m } from '$lib/paraglide/messages.js';
</script>

<main
	class="bg-background flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center"
>
	<div class="space-y-2">
		<h1 class="text-foreground text-7xl font-bold tracking-tighter">
			{page.status}
		</h1>
		<p class="text-muted-foreground text-xl">
			{page.error?.message ?? m.error_unexpected()}
		</p>
	</div>
	<div class="flex gap-3">
		<Button variant="outline" onclick={() => history.back()}>
			{m.error_go_back()}
		</Button>
		<Button href={localizeHref('/')}>
			{m.error_home()}
		</Button>
	</div>
</main>
