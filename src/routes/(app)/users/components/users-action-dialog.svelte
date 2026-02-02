<script lang="ts">
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { toast } from 'svelte-sonner';
	import { simulateServer } from '$lib/utils/simulate-server.js';
	import { getUserFormSchema } from '../data/schema.js';
	import type { User, UserRole, UserStatus } from '../data/schema.js';
	import { getRoles, getUserStatuses } from '../data/data.js';
	import { getUsersContext } from '../context.js';
	import { m } from '$lib/paraglide/messages.js';

	const userFormSchema = getUserFormSchema();
	const roles = getRoles();
	const userStatuses = getUserStatuses();

	let {
		open = $bindable(false),
		onOpenChange,
		currentRow = null
	}: {
		open: boolean;
		onOpenChange: (open: boolean) => void;
		currentRow?: User | null;
	} = $props();

	const ctx = getUsersContext();
	const isEdit = $derived(!!currentRow);

	const form = superForm(
		defaults(
			{
				firstName: '',
				lastName: '',
				username: '',
				email: '',
				phoneNumber: '',
				role: 'admin' as UserRole,
				status: 'active' as UserStatus
			},
			zod4Client(userFormSchema)
		),
		{
			SPA: true,
			id: 'user-action-form',
			validators: zod4Client(userFormSchema),
			async onUpdate({ form: f }) {
				if (f.valid) {
					const wasEdit = isEdit;
					onOpenChange(false);
					try {
						if (wasEdit && currentRow) {
							await ctx.apply(
								(users) =>
									users.map((u) =>
										u.id === currentRow.id
											? {
													...u,
													firstName: f.data.firstName,
													lastName: f.data.lastName,
													username: f.data.username ?? u.username,
													email: f.data.email,
													phoneNumber: f.data.phoneNumber,
													role: f.data.role,
													status: f.data.status,
													updatedAt: new Date()
												}
											: u
									),
								() => simulateServer(null)
							);
						} else {
							const newUser: User = {
								id: crypto.randomUUID(),
								firstName: f.data.firstName,
								lastName: f.data.lastName,
								username:
									f.data.username ??
									`${f.data.firstName.toLowerCase()}_${f.data.lastName.toLowerCase()}`,
								email: f.data.email,
								phoneNumber: f.data.phoneNumber,
								role: f.data.role,
								status: f.data.status,
								createdAt: new Date(),
								updatedAt: new Date()
							};
							await ctx.apply(
								(users) => [newUser, ...users],
								() => simulateServer(null)
							);
						}
						toast.success(wasEdit ? m.users_toast_updated() : m.users_toast_added());
					} catch {
						toast.error(m.toast_action_failed());
					}
				}
			}
		}
	);

	const { form: formData, enhance, reset } = form;

	// Populate form on open, reset on new
	$effect(() => {
		if (open && currentRow) {
			$formData.firstName = currentRow.firstName;
			$formData.lastName = currentRow.lastName;
			$formData.username = currentRow.username;
			$formData.email = currentRow.email;
			$formData.phoneNumber = currentRow.phoneNumber;
			$formData.role = currentRow.role;
			$formData.status = currentRow.status;
		} else if (open && !currentRow) {
			reset();
		}
	});

	function handleOpenChange(state: boolean) {
		if (!state) {
			reset();
		}
		onOpenChange(state);
	}

	const selectedRoleLabel = $derived(
		roles.find((r) => r.value === $formData.role)?.label || m.users_select_role()
	);
	const selectedStatusLabel = $derived(
		userStatuses.find((s) => s.value === $formData.status)?.label || m.users_select_status()
	);
</script>

<Dialog.Root {open} onOpenChange={handleOpenChange}>
	<Dialog.Content class="sm:max-w-lg">
		<Dialog.Header class="text-start">
			<Dialog.Title>{isEdit ? m.users_edit_user() : m.users_add_new_user()}</Dialog.Title>
			<Dialog.Description>
				{isEdit ? m.users_edit_desc() : m.users_add_desc()}
				{m.users_save_instruction()}
			</Dialog.Description>
		</Dialog.Header>
		<ScrollArea class="-me-3 h-[26rem] w-full pe-3">
			<form id="user-form" method="POST" use:enhance class="space-y-4 px-1 pt-1">
				<Form.Field {form} name="firstName">
					<Form.Control>
						{#snippet children({ props })}
							<div class="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
								<Form.Label class="col-span-2 text-end">{m.users_field_first_name()}</Form.Label>
								<Input
									{...props}
									bind:value={$formData.firstName}
									placeholder={m.users_placeholder_first_name()}
									class="col-span-4"
									autocomplete="off"
								/>
								<div class="col-span-4 col-start-3">
									<Form.FieldErrors />
								</div>
							</div>
						{/snippet}
					</Form.Control>
				</Form.Field>

				<Form.Field {form} name="lastName">
					<Form.Control>
						{#snippet children({ props })}
							<div class="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
								<Form.Label class="col-span-2 text-end">{m.users_field_last_name()}</Form.Label>
								<Input
									{...props}
									bind:value={$formData.lastName}
									placeholder={m.users_placeholder_last_name()}
									class="col-span-4"
									autocomplete="off"
								/>
								<div class="col-span-4 col-start-3">
									<Form.FieldErrors />
								</div>
							</div>
						{/snippet}
					</Form.Control>
				</Form.Field>

				<Form.Field {form} name="username">
					<Form.Control>
						{#snippet children({ props })}
							<div class="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
								<Form.Label class="col-span-2 text-end">{m.users_col_username()}</Form.Label>
								<Input
									{...props}
									bind:value={$formData.username}
									placeholder={m.users_placeholder_username()}
									class="col-span-4"
								/>
								<div class="col-span-4 col-start-3">
									<Form.FieldErrors />
								</div>
							</div>
						{/snippet}
					</Form.Control>
				</Form.Field>

				<Form.Field {form} name="email">
					<Form.Control>
						{#snippet children({ props })}
							<div class="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
								<Form.Label class="col-span-2 text-end">{m.users_col_email()}</Form.Label>
								<Input
									{...props}
									type="email"
									bind:value={$formData.email}
									placeholder={m.users_placeholder_email()}
									class="col-span-4"
								/>
								<div class="col-span-4 col-start-3">
									<Form.FieldErrors />
								</div>
							</div>
						{/snippet}
					</Form.Control>
				</Form.Field>

				<Form.Field {form} name="phoneNumber">
					<Form.Control>
						{#snippet children({ props })}
							<div class="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
								<Form.Label class="col-span-2 text-end">{m.users_col_phone()}</Form.Label>
								<Input
									{...props}
									type="tel"
									bind:value={$formData.phoneNumber}
									placeholder={m.users_placeholder_phone()}
									class="col-span-4"
								/>
								<div class="col-span-4 col-start-3">
									<Form.FieldErrors />
								</div>
							</div>
						{/snippet}
					</Form.Control>
				</Form.Field>

				<Form.Field {form} name="role">
					<Form.Control>
						{#snippet children({ props })}
							<div class="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
								<Form.Label class="col-span-2 text-end">{m.users_col_role()}</Form.Label>
								<Select.Root
									type="single"
									value={$formData.role}
									onValueChange={(v) => {
										if (v) $formData.role = v as UserRole;
									}}
								>
									<Select.Trigger {...props} class="col-span-4">
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
								<div class="col-span-4 col-start-3">
									<Form.FieldErrors />
								</div>
							</div>
						{/snippet}
					</Form.Control>
				</Form.Field>

				<Form.Field {form} name="status">
					<Form.Control>
						{#snippet children({ props })}
							<div class="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
								<Form.Label class="col-span-2 text-end">{m.users_col_status()}</Form.Label>
								<Select.Root
									type="single"
									value={$formData.status}
									onValueChange={(v) => {
										if (v) $formData.status = v as UserStatus;
									}}
								>
									<Select.Trigger {...props} class="col-span-4">
										<span class={$formData.status ? '' : 'text-muted-foreground'}>
											{selectedStatusLabel}
										</span>
									</Select.Trigger>
									<Select.Content>
										{#each userStatuses as status (status.value)}
											<Select.Item value={status.value}>{status.label}</Select.Item>
										{/each}
									</Select.Content>
								</Select.Root>
								<div class="col-span-4 col-start-3">
									<Form.FieldErrors />
								</div>
							</div>
						{/snippet}
					</Form.Control>
				</Form.Field>
			</form>
		</ScrollArea>
		<Dialog.Footer>
			<Dialog.Close>
				{#snippet child({ props })}
					<Button {...props} variant="outline">{m.common_cancel()}</Button>
				{/snippet}
			</Dialog.Close>
			<Button type="submit" form="user-form">{m.common_save_changes()}</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
