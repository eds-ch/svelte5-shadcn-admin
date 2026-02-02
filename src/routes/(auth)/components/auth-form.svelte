<script lang="ts">
	import { z } from 'zod';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { toast } from 'svelte-sonner';
	import Github from '@lucide/svelte/icons/github';
	import Facebook from '@lucide/svelte/icons/facebook';
	import PasswordInput from './password-input.svelte';
	import { localizeHref } from '$lib/paraglide/runtime.js';
	import { m } from '$lib/paraglide/messages.js';
	import { PASSWORD_MIN_LENGTH } from '$lib/config';

	const authFormSchema = z.object({
		email: z.email(m.validation_email_invalid()),
		password: z
			.string()
			.min(1, m.validation_password_required())
			.min(PASSWORD_MIN_LENGTH, m.validation_password_min_length())
	});

	const form = superForm(defaults({ email: '', password: '' }, zod4Client(authFormSchema)), {
		SPA: true,
		validators: zod4Client(authFormSchema),
		onUpdate({ form: f }) {
			if (f.valid) {
				toast.success(m.auth_sign_in_success());
			}
		}
	});

	const { form: formData, enhance, submitting } = form;
</script>

<!-- method="POST" + use:enhance needed for SuperForms SPA mode (no server action) -->
<form method="POST" use:enhance class="grid gap-3">
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

	<Form.Field {form} name="password">
		<Form.Control>
			{#snippet children({ props })}
				<div class="relative">
					<Form.Label>{m.auth_password_label()}</Form.Label>
					<a
						href={localizeHref('/forgot-password')}
						class="text-muted-foreground absolute end-0 -top-0.5 text-sm font-medium hover:opacity-75"
					>
						{m.auth_forgot_password_link()}
					</a>
				</div>
				<PasswordInput
					{...props}
					autocomplete="current-password"
					bind:value={$formData.password}
					placeholder={m.auth_password_placeholder()}
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Button type="submit" class="mt-2" disabled={$submitting}>
		{#if $submitting}
			{m.auth_signing_in()}
		{:else}
			{m.auth_sign_in_button()}
		{/if}
	</Button>

	<div class="relative my-2">
		<div class="absolute inset-0 flex items-center">
			<span class="w-full border-t"></span>
		</div>
		<div class="relative flex justify-center text-xs uppercase">
			<span class="bg-background text-muted-foreground px-2">{m.auth_or_continue_with()}</span>
		</div>
	</div>

	<div class="grid grid-cols-2 gap-2">
		<Button variant="outline" type="button" disabled={$submitting}>
			<Github class="h-4 w-4" />
			{m.auth_github()}
		</Button>
		<Button variant="outline" type="button" disabled={$submitting}>
			<Facebook class="h-4 w-4" />
			{m.auth_facebook()}
		</Button>
	</div>
</form>
