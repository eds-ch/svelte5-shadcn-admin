<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import Zap from '@lucide/svelte/icons/zap';
	import ForgotPasswordForm from '../components/forgot-password-form.svelte';
	import { localizeHref } from '$lib/paraglide/runtime.js';
	import { m } from '$lib/paraglide/messages.js';
</script>

<svelte:head>
	<title>{m.auth_forgot_password_title()} | {m.auth_brand()}</title>
</svelte:head>

<div class="mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8">
	<div class="mb-4 flex items-center justify-center">
		<Zap class="me-2 size-6" />
		<h1 class="text-xl font-medium">{m.auth_brand()}</h1>
	</div>
	<Card.Root class="gap-4">
		<Card.Header>
			<Card.Title class="text-lg tracking-tight">{m.auth_forgot_password_title()}</Card.Title>
			<Card.Description>
				{m.auth_forgot_password_desc()}
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<ForgotPasswordForm />
		</Card.Content>
		<Card.Footer>
			<p class="text-muted-foreground mx-auto px-8 text-center text-sm text-balance">
				{m.auth_no_account()}
				<a href={localizeHref('/sign-up')} class="hover:text-primary underline underline-offset-4"
					>{m.nav_sign_up()}</a
				>.
			</p>
		</Card.Footer>
	</Card.Root>
</div>
