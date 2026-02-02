<script lang="ts">
	import { z } from 'zod';
	import { m } from '$lib/paraglide/messages.js';
	import { onMount } from 'svelte';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { toast } from 'svelte-sonner';
	import { cn } from '$lib/utils';

	let { formState = $bindable<Record<string, unknown> | null>(null) } = $props();
	let _mounted = false;

	const profileFormSchema = z.object({
		username: z.string().min(2, m.validation_username_min()).max(30, m.validation_username_max()),
		email: z.email(m.validation_email_invalid()),
		bio: z.string().min(4, m.validation_bio_min()).max(160, m.validation_bio_max()),
		urls: z
			.array(
				z.object({
					value: z.url(m.validation_url_invalid())
				})
			)
			.optional()
	});

	const form = superForm(
		defaults(
			{
				username: '',
				email: '',
				bio: 'Full-stack developer and open source enthusiast.',
				urls: [] as { value: string }[]
			},
			zod4Client(profileFormSchema)
		),
		{
			SPA: true,
			dataType: 'json',
			validators: zod4Client(profileFormSchema),
			onUpdate({ form: f }) {
				if (f.valid) {
					toast.success(m.settings_profile_toast());
				}
			}
		}
	);

	const { form: formData, enhance, submitting } = form;

	// Workaround: superForm + zod4Client crashes during SSR when defaults()
	// contains a non-empty array of objects. Populate after mount instead.
	onMount(() => {
		if (formState) {
			Object.assign($formData, formState);
		} else {
			$formData.urls = [{ value: 'https://vortexhq.io' }, { value: 'https://github.com/vortex' }];
		}
		_mounted = true;
	});

	$effect(() => {
		const data = structuredClone($formData);
		if (_mounted) {
			formState = data as Record<string, unknown>;
		}
	});

	const emails = ['kira@vortexhq.io', 'admin@vortex.dev', 'kira@example.com'];

	const selectedEmailLabel = $derived($formData.email || m.settings_profile_email_select());

	function addUrl() {
		$formData.urls = [...($formData.urls ?? []), { value: '' }];
	}

	function removeUrl(index: number) {
		$formData.urls = ($formData.urls ?? []).filter((_, i) => i !== index);
	}
</script>

<form method="POST" use:enhance class="space-y-8" novalidate>
	<Form.Field {form} name="username">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>{m.settings_profile_username()}</Form.Label>
				<Input
					{...props}
					bind:value={$formData.username}
					placeholder={m.settings_profile_username_placeholder()}
				/>
			{/snippet}
		</Form.Control>
		<Form.Description>
			{m.settings_profile_username_desc()}
		</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="email">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>{m.auth_email_label()}</Form.Label>
				<Select.Root
					type="single"
					value={$formData.email}
					onValueChange={(v) => {
						if (v) $formData.email = v;
					}}
				>
					<Select.Trigger {...props} class="w-full">
						<span class={$formData.email ? '' : 'text-muted-foreground'}>
							{selectedEmailLabel}
						</span>
					</Select.Trigger>
					<Select.Content>
						{#each emails as email (email)}
							<Select.Item value={email}>{email}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.Description>
			{@html m.settings_profile_email_desc({
				link: `<a href="/" class="underline">${m.settings_profile_email_link()}</a>`
			})}
		</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="bio">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>{m.settings_profile_bio()}</Form.Label>
				<Textarea
					{...props}
					bind:value={$formData.bio}
					placeholder={m.settings_profile_bio_placeholder()}
					class="resize-none"
				/>
			{/snippet}
		</Form.Control>
		<Form.Description>
			{m.settings_profile_bio_desc()}
		</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<div>
		{#each $formData.urls ?? [] as _, i (i)}
			<Form.Field {form} name="urls[{i}].value">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class={cn(i !== 0 && 'sr-only')}>{m.settings_profile_urls()}</Form.Label>
						<Form.Description class={cn(i !== 0 && 'sr-only')}>
							{m.settings_profile_urls_desc()}
						</Form.Description>
						<div class={cn('flex items-center gap-2', i !== 0 && 'mt-1.5')}>
							<Input
								{...props}
								bind:value={$formData.urls![i].value}
								placeholder={m.settings_profile_urls_placeholder()}
								class="flex-1"
							/>
							{#if ($formData.urls?.length ?? 0) > 1}
								<Button type="button" variant="outline" size="sm" onclick={() => removeUrl(i)}>
									{m.settings_profile_remove()}
								</Button>
							{/if}
						</div>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		{/each}
		<Button type="button" variant="outline" size="sm" class="mt-2" onclick={addUrl}>
			{m.settings_profile_add_url()}
		</Button>
	</div>

	<Button type="submit" disabled={$submitting}>{m.settings_profile_update()}</Button>
</form>
