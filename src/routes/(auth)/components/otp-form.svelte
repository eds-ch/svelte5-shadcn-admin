<script lang="ts">
	import * as InputOTP from '$lib/components/ui/input-otp/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { toast } from 'svelte-sonner';
	import { m } from '$lib/paraglide/messages.js';

	let value = $state('');
	let isLoading = $state(false);
	let showIncompleteHint = $derived(value.length > 0 && value.length < 6);

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (value.length < 6) return;

		isLoading = true;
		toast.success(m.auth_otp_success());

		setTimeout(() => {
			isLoading = false;
		}, 1000);
	}
</script>

<form onsubmit={handleSubmit} class="grid gap-2">
	<div class="flex items-center justify-center">
		<InputOTP.Root
			maxlength={6}
			bind:value
			autocomplete="one-time-code"
			aria-label={m.auth_otp_aria_label()}
		>
			{#snippet children({ cells })}
				<InputOTP.Group>
					{#each cells.slice(0, 2) as cell (cell)}
						<InputOTP.Slot {cell} />
					{/each}
				</InputOTP.Group>
				<InputOTP.Separator />
				<InputOTP.Group>
					{#each cells.slice(2, 4) as cell (cell)}
						<InputOTP.Slot {cell} />
					{/each}
				</InputOTP.Group>
				<InputOTP.Separator />
				<InputOTP.Group>
					{#each cells.slice(4, 6) as cell (cell)}
						<InputOTP.Slot {cell} />
					{/each}
				</InputOTP.Group>
			{/snippet}
		</InputOTP.Root>
	</div>
	{#if showIncompleteHint}
		<p class="text-muted-foreground text-center text-sm">{m.auth_otp_incomplete()}</p>
	{/if}

	<Button type="submit" class="mt-2" disabled={value.length < 6 || isLoading}>
		{m.auth_otp_verify()}
	</Button>
</form>
