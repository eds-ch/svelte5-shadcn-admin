<script lang="ts">
	import Zap from '@lucide/svelte/icons/zap';
	import AuthForm from '../components/auth-form.svelte';
	import { localizeHref } from '$lib/paraglide/runtime.js';
	import { m } from '$lib/paraglide/messages.js';
</script>

<svelte:head>
	<title>{m.auth_sign_in_title()} | {m.auth_brand()}</title>
</svelte:head>

<div
	class="relative flex min-h-svh flex-col items-center justify-center lg:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
>
	<div class="lg:p-8">
		<div class="mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8">
			<div class="mb-4 flex items-center justify-center">
				<Zap class="me-2 size-6" />
				<h1 class="text-xl font-medium">{m.auth_brand()}</h1>
			</div>
		</div>
		<div class="mx-auto flex w-full max-w-sm flex-col justify-center space-y-2">
			<div class="flex flex-col space-y-2 text-start">
				<h2 class="text-lg font-semibold tracking-tight">{m.auth_sign_in_title()}</h2>
				<p class="text-muted-foreground text-sm">
					{m.auth_sign_in_desc()}
				</p>
			</div>
			<AuthForm />
			<p class="text-muted-foreground px-8 text-center text-sm">
				{m.auth_legal_sign_in()}
				<a href={localizeHref('/terms')} class="hover:text-primary underline underline-offset-4"
					>{m.auth_terms_of_service()}</a
				>
				<a href={localizeHref('/privacy')} class="hover:text-primary underline underline-offset-4"
					>{m.auth_privacy_policy()}</a
				>.
			</p>
		</div>
	</div>

	<div
		class="bg-muted text-primary-foreground relative hidden h-full flex-col p-10 lg:flex dark:border-l"
	>
		<div class="bg-primary absolute inset-0"></div>
		<div class="relative z-20 flex items-center text-lg font-medium">
			<Zap class="me-2 size-6" />
			{m.auth_brand()}
		</div>
		<div class="relative z-20 mt-auto">
			<blockquote class="space-y-2">
				<p class="text-lg">
					&ldquo;{m.auth_testimonial_quote()}&rdquo;
				</p>
				<footer class="text-sm">{m.auth_testimonial_author()}</footer>
			</blockquote>
		</div>
	</div>
</div>
