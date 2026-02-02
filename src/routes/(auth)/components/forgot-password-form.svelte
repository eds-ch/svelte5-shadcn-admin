<script lang="ts">
	import { z } from 'zod';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { toast } from 'svelte-sonner';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import { m } from '$lib/paraglide/messages.js';

	const forgotPasswordSchema = z.object({
		email: z.email(m.validation_email_invalid())
	});

	const form = superForm(defaults({ email: '' }, zod4Client(forgotPasswordSchema)), {
		SPA: true,
		validators: zod4Client(forgotPasswordSchema),
		onUpdate({ form: f }) {
			if (f.valid) {
				toast.success(m.auth_forgot_password_success());
			}
		}
	});

	const { form: formData, enhance, submitting } = form;
</script>

<form method="POST" use:enhance class="grid gap-2">
	<Form.Field {form} name="email">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>{m.auth_email_label()}</Form.Label>
				<Input
					{...props}
					type="email"
					autocomplete="email"
					bind:value={$formData.email}
					placeholder={m.auth_email_placeholder()}
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Button type="submit" class="mt-2" disabled={$submitting}>
		{m.common_continue()}
		{#if $submitting}
			<LoaderCircle class="animate-spin" />
		{:else}
			<ArrowRight />
		{/if}
	</Button>
</form>
