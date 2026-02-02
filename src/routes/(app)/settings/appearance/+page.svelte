<script lang="ts">
	import ContentSection from '../components/content-section.svelte';
	import AppearanceForm from '../components/appearance-form.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { pageTitle } from '$lib/config';
</script>

<svelte:head>
	<title>{pageTitle(m.nav_appearance())}</title>
</svelte:head>

<ContentSection title={m.nav_appearance()} desc={m.settings_appearance_desc()}>
	<AppearanceForm />
</ContentSection>
