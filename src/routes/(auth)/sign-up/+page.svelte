<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import Zap from '@lucide/svelte/icons/zap';
	import SignUpForm from '../components/sign-up-form.svelte';
	import { localizeHref } from '$lib/paraglide/runtime.js';
	import { m } from '$lib/paraglide/messages.js';
</script>

<svelte:head>
	<title>{m.auth_create_account_title()} | {m.auth_brand()}</title>
</svelte:head>

<div class="mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8">
	<div class="mb-4 flex items-center justify-center">
		<Zap class="me-2 size-6" />
		<h1 class="text-xl font-medium">{m.auth_brand()}</h1>
	</div>
	<Card.Root class="gap-4">
		<Card.Header>
			<Card.Title class="text-lg tracking-tight">{m.auth_create_account_title()}</Card.Title>
			<Card.Description>
				{m.auth_create_account_desc()} <br />
				{m.auth_already_have_account()}
				<a href={localizeHref('/sign-in')} class="hover:text-primary underline underline-offset-4"
					>{m.nav_sign_in()}</a
				>
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<SignUpForm />
		</Card.Content>
		<Card.Footer>
			<p class="text-muted-foreground px-8 text-center text-sm">
				{m.auth_legal_create_account()}
				<a href={localizeHref('/terms')} class="hover:text-primary underline underline-offset-4"
					>{m.auth_terms_of_service()}</a
				>
				<a href={localizeHref('/privacy')} class="hover:text-primary underline underline-offset-4"
					>{m.auth_privacy_policy()}</a
				>.
			</p>
		</Card.Footer>
	</Card.Root>
</div>
