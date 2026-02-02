<script lang="ts" module>
	import { z } from 'zod';

	const notificationsFormSchema = z.object({
		type: z.enum(['all', 'mentions', 'none']),
		communication_emails: z.boolean().default(false).optional(),
		marketing_emails: z.boolean().default(false).optional(),
		social_emails: z.boolean().default(false).optional(),
		security_emails: z.boolean(),
		mobile: z.boolean().default(false).optional()
	});
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { simulateServer } from '$lib/utils/simulate-server.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { m } from '$lib/paraglide/messages.js';

	let { formState = $bindable<Record<string, unknown> | null>(null) } = $props();
	let _mounted = false;

	const form = superForm(
		defaults(
			{
				type: 'all' as 'all' | 'mentions' | 'none',
				communication_emails: false,
				marketing_emails: false,
				social_emails: true,
				security_emails: true,
				mobile: false
			},
			zod4Client(notificationsFormSchema)
		),
		{
			SPA: true,
			validators: zod4Client(notificationsFormSchema),
			async onUpdate({ form: f }) {
				if (f.valid) {
					try {
						await simulateServer(null);
						toast.success(m.settings_notif_toast());
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
</script>

<form method="POST" use:enhance class="space-y-8" novalidate>
	<Form.Fieldset {form} name="type" class="space-y-3">
		<Form.Legend>{m.settings_notif_legend()}</Form.Legend>
		<RadioGroup.Root
			value={$formData.type}
			onValueChange={(v) => {
				if (v) $formData.type = v as 'all' | 'mentions' | 'none';
			}}
			class="flex flex-col gap-2"
		>
			<div class="flex items-center space-x-3">
				<Form.Control>
					{#snippet children({ props })}
						<RadioGroup.Item value="all" {...props} />
						<Form.Label class="font-normal">{m.settings_notif_all()}</Form.Label>
					{/snippet}
				</Form.Control>
			</div>
			<div class="flex items-center space-x-3">
				<Form.Control>
					{#snippet children({ props })}
						<RadioGroup.Item value="mentions" {...props} />
						<Form.Label class="font-normal">{m.settings_notif_mentions()}</Form.Label>
					{/snippet}
				</Form.Control>
			</div>
			<div class="flex items-center space-x-3">
				<Form.Control>
					{#snippet children({ props })}
						<RadioGroup.Item value="none" {...props} />
						<Form.Label class="font-normal">{m.settings_notif_none()}</Form.Label>
					{/snippet}
				</Form.Control>
			</div>
		</RadioGroup.Root>
		<Form.FieldErrors />
	</Form.Fieldset>

	{#snippet switchField(
		name: 'communication_emails' | 'marketing_emails' | 'social_emails' | 'security_emails',
		label: string,
		description: string,
		opts?: { disabled?: boolean }
	)}
		<Form.Field
			{form}
			{name}
			class="flex flex-row items-center justify-between rounded-lg border p-4"
		>
			<Form.Control>
				{#snippet children({ props })}
					<div class="space-y-0.5">
						<Form.Label class="text-base">{label}</Form.Label>
						<Form.Description>{description}</Form.Description>
					</div>
					<Switch
						{...props}
						aria-readonly={opts?.disabled || undefined}
						disabled={opts?.disabled}
						checked={$formData[name] ?? false}
						onCheckedChange={(v) => {
							if (typeof v === 'boolean') $formData[name] = v;
						}}
					/>
				{/snippet}
			</Form.Control>
		</Form.Field>
	{/snippet}

	<div>
		<h3 class="mb-4 text-lg font-medium">{m.settings_notif_email_heading()}</h3>
		<div class="space-y-4">
			{@render switchField(
				'communication_emails',
				m.settings_notif_comm_label(),
				m.settings_notif_comm_desc()
			)}
			{@render switchField(
				'marketing_emails',
				m.settings_notif_marketing_label(),
				m.settings_notif_marketing_desc()
			)}
			{@render switchField(
				'social_emails',
				m.settings_notif_social_label(),
				m.settings_notif_social_desc()
			)}
			{@render switchField(
				'security_emails',
				m.settings_notif_security_label(),
				m.settings_notif_security_desc(),
				{ disabled: true }
			)}
		</div>
	</div>

	<Form.Field {form} name="mobile" class="flex flex-row items-start space-x-3">
		<Form.Control>
			{#snippet children({ props })}
				<Checkbox
					{...props}
					checked={$formData.mobile}
					onCheckedChange={(v) => {
						if (typeof v === 'boolean') $formData.mobile = v;
					}}
				/>
				<div class="space-y-1 leading-none">
					<Form.Label>{m.settings_notif_mobile_label()}</Form.Label>
					<Form.Description>
						{@html m.settings_notif_mobile_desc({
							link: `<a href="/settings" class="underline decoration-dashed underline-offset-4 hover:decoration-solid">${m.settings_notif_mobile_link()}</a>`
						})}
					</Form.Description>
				</div>
			{/snippet}
		</Form.Control>
	</Form.Field>

	<Button type="submit" disabled={$submitting}>{m.settings_notif_update()}</Button>
</form>
