<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { m } from '$lib/paraglide/messages.js';
	import { toast } from 'svelte-sonner';

	let { open = $bindable(false) }: { open: boolean } = $props();

	function handleSignOut() {
		open = false;
		toast(m.sign_out_success_title(), {
			description: m.sign_out_success_description()
		});
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>{m.sign_out_title()}</Dialog.Title>
			<Dialog.Description>{m.sign_out_confirm_message()}</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button variant="secondary" onclick={() => (open = false)}>{m.common_cancel()}</Button>
			<Button variant="destructive" onclick={handleSignOut}>{m.sign_out_title()}</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
