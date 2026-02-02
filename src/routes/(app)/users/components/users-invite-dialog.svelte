<script lang="ts">
	import MailPlusIcon from '@lucide/svelte/icons/mail-plus';
	import SendIcon from '@lucide/svelte/icons/send';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { toast } from 'svelte-sonner';
	import { getUserInviteFormSchema } from '../data/schema.js';
	import { getRoles } from '../data/data.js';
	import type { UserRole } from '../data/schema.js';
	import { m } from '$lib/paraglide/messages.js';

	const userInviteFormSchema = getUserInviteFormSchema();
	const roles = getRoles();

	let {
		open = $bindable(false),
		onOpenChange
	}: {
		open: boolean;
		onOpenChange: (open: boolean) => void;
	} = $props();

	const form = superForm(
		defaults(
			{ email: '', role: 'admin' as UserRole, description: '' },
			zod4Client(userInviteFormSchema)
		),
		{
			SPA: true,
			id: 'invite-user',
			validators: zod4Client(userInviteFormSchema),
			onUpdate({ form: f }) {
				if (f.valid) {
					toast.success(m.users_toast_invited());
					onOpenChange(false);
				}
			}
		}
	);

	const { form: formData, enhance, reset } = form;

	function handleOpenChange(state: boolean) {
		if (!state) {
			reset();
		}
		onOpenChange(state);
	}

	const selectedRoleLabel = $derived(
		roles.find((r) => r.value === $formData.role)?.label || m.users_select_role()
	);
</script>

<Dialog.Root {open} onOpenChange={handleOpenChange}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header class="text-start">
			<Dialog.Title class="flex items-center gap-2">
				<MailPlusIcon class="size-[18px]" />
				{m.users_invite_title()}
			</Dialog.Title>
			<Dialog.Description>
				{m.users_invite_desc()}
			</Dialog.Description>
		</Dialog.Header>
		<form id="user-invite-form" method="POST" use:enhance class="space-y-4">
			<Form.Field {form} name="email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>{m.users_col_email()}</Form.Label>
						<Input
							{...props}
							type="email"
							bind:value={$formData.email}
							placeholder={m.users_invite_email_placeholder()}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="role">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>{m.users_col_role()}</Form.Label>
						<Select.Root
							type="single"
							value={$formData.role}
							onValueChange={(v) => {
								if (v) $formData.role = v as UserRole;
							}}
						>
							<Select.Trigger {...props} class="w-full">
								<span class={$formData.role ? '' : 'text-muted-foreground'}>
									{selectedRoleLabel}
								</span>
							</Select.Trigger>
							<Select.Content>
								{#each roles as role (role.value)}
									<Select.Item value={role.value}>{role.label}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="description">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>{m.users_invite_desc_label()}</Form.Label>
						<Textarea
							{...props}
							bind:value={$formData.description as string}
							class="resize-none"
							placeholder={m.users_invite_desc_placeholder()}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</form>
		<Dialog.Footer class="gap-y-2">
			<Dialog.Close>
				{#snippet child({ props })}
					<Button {...props} variant="outline">{m.common_cancel()}</Button>
				{/snippet}
			</Dialog.Close>
			<Button type="submit" form="user-invite-form">
				{m.users_invite_button()}
				<SendIcon class="size-4" />
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
