<script lang="ts">
	import ContentSection from '../components/content-section.svelte';
	import AccountForm from '../components/account-form.svelte';
	import type { Snapshot } from './$types';
	import { m } from '$lib/paraglide/messages.js';
	import { pageTitle } from '$lib/config';

	let formState = $state<Record<string, unknown> | null>(null);

	export const snapshot: Snapshot<{ formState: Record<string, unknown> | null }> = {
		capture: () => ({ formState }),
		restore: (value) => {
			formState = value.formState;
		}
	};
</script>

<svelte:head>
	<title>{pageTitle(m.nav_account())}</title>
</svelte:head>

<ContentSection title={m.nav_account()} desc={m.settings_account_desc()}>
	<AccountForm bind:formState />
</ContentSection>
