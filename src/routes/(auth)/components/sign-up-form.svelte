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
	import { m } from '$lib/paraglide/messages.js';
	import { PASSWORD_MIN_LENGTH } from '$lib/config';

	const signUpFormSchema = z
		.object({
			email: z.email(m.validation_email_invalid()),
			password: z
				.string()
				.min(1, m.validation_password_required())
				.min(PASSWORD_MIN_LENGTH, m.validation_password_min_length()),
			confirmPassword: z.string().min(1, m.validation_confirm_password_required())
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: m.validation_passwords_no_match(),
			path: ['confirmPassword']
		});

	const form = superForm(
		defaults({ email: '', password: '', confirmPassword: '' }, zod4Client(signUpFormSchema)),
		{
			SPA: true,
			validators: zod4Client(signUpFormSchema),
			onUpdate({ form: f }) {
				if (f.valid) {
					toast.success(m.auth_sign_up_success());
				}
			}
		}
	);

	const { form: formData, enhance, submitting } = form;
</script>

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
				<Form.Label>{m.auth_password_label()}</Form.Label>
				<PasswordInput
					{...props}
					autocomplete="new-password"
					bind:value={$formData.password}
					placeholder={m.auth_password_placeholder()}
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="confirmPassword">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>{m.auth_confirm_password_label()}</Form.Label>
				<PasswordInput
					{...props}
					autocomplete="new-password"
					bind:value={$formData.confirmPassword}
					placeholder={m.auth_password_placeholder()}
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Button type="submit" class="mt-2" disabled={$submitting}>
		{#if $submitting}
			{m.auth_creating_account()}
		{:else}
			{m.auth_create_account_button()}
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
