<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { localizeHref } from '$lib/paraglide/runtime.js';
	import { m } from '$lib/paraglide/messages.js';
</script>

<svelte:head>
	<title>500 - {m.error_500_title()} | Dashboard</title>
</svelte:head>

<h1 class="text-[7rem] leading-tight font-bold">500</h1>
<h2 class="font-medium">{m.error_500_title()}</h2>
<p class="text-muted-foreground text-center">
	{m.error_500_desc()}
</p>
<div class="mt-6 flex gap-4">
	<Button variant="outline" onclick={() => history.back()}>{m.error_go_back()}</Button>
	<Button href={localizeHref('/')}>{m.error_back_to_home()}</Button>
</div>
