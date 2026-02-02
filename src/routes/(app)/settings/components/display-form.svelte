<script lang="ts">
	import { onMount } from 'svelte';
	import { z } from 'zod';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { simulateServer } from '$lib/utils/simulate-server.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { m } from '$lib/paraglide/messages.js';

	let { formState = $bindable<Record<string, unknown> | null>(null) } = $props();
	let _mounted = false;

	const items = [
		{ id: 'recents', label: m.settings_display_recents() },
		{ id: 'home', label: m.settings_display_home() },
		{ id: 'applications', label: m.settings_display_applications() },
		{ id: 'desktop', label: m.settings_display_desktop() },
		{ id: 'downloads', label: m.settings_display_downloads() },
		{ id: 'documents', label: m.settings_display_documents() }
	];

	const displayFormSchema = z.object({
		items: z.array(z.string()).refine((value) => value.some((item) => item), {
			message: m.validation_display_min_one()
		})
	});

	const form = superForm(
		defaults(
			{
				items: ['recents', 'home']
			},
			zod4Client(displayFormSchema)
		),
		{
			SPA: true,
			validators: zod4Client(displayFormSchema),
			async onUpdate({ form: f }) {
				if (f.valid) {
					try {
						await simulateServer(null);
						toast.success(m.settings_display_toast());
					} catch {
						toast.error(m.toast_action_failed());
					}
				}
			}
		}
	);

	const { form: formData, enhance, submitting } = form;

	onMount(() => {
		if (formState) {
			Object.assign($formData, formState);
		}
		_mounted = true;
	});

	$effect(() => {
		const data = structuredClone($formData);
		if (_mounted) {
			formState = data as Record<string, unknown>;
		}
	});

	function addItem(id: string) {
		$formData.items = [...$formData.items, id];
	}

	function removeItem(id: string) {
		$formData.items = $formData.items.filter((i) => i !== id);
	}
</script>

<form method="POST" use:enhance class="space-y-8" novalidate>
	<Form.Fieldset {form} name="items" class="space-y-0">
		<div class="mb-4">
			<Form.Legend class="text-base">{m.settings_display_sidebar()}</Form.Legend>
			<Form.Description>
				{m.settings_display_sidebar_desc()}
			</Form.Description>
		</div>
		<div class="space-y-2">
			{#each items as item (item.id)}
				{@const checked = $formData.items.includes(item.id)}
				<div class="flex flex-row items-start space-x-3">
					<Form.Control>
						{#snippet children({ props })}
							<Checkbox
								{...props}
								{checked}
								value={item.id}
								onCheckedChange={(v) => {
									if (v) {
										addItem(item.id);
									} else {
										removeItem(item.id);
									}
								}}
							/>
							<Form.Label class="font-normal">
								{item.label}
							</Form.Label>
						{/snippet}
					</Form.Control>
				</div>
			{/each}
			<Form.FieldErrors />
		</div>
	</Form.Fieldset>

	<Button type="submit" disabled={$submitting}>{m.settings_display_update()}</Button>
</form>
