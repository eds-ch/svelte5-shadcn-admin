<script lang="ts">
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { toast } from 'svelte-sonner';
	import { simulateServer } from '$lib/utils/simulate-server.js';
	import { getTaskFormSchema, type Task, type TaskFormData } from '../data/schema.js';
	import { getStatuses, getLabels, getPriorities } from '../data/data.js';
	import { getTasksContext } from '../context.js';
	import { m } from '$lib/paraglide/messages.js';

	const taskFormSchema = getTaskFormSchema();
	const statuses = getStatuses();
	const labels = getLabels();
	const priorities = getPriorities();

	let {
		open = $bindable(false),
		onOpenChange,
		currentRow = null
	}: {
		open: boolean;
		onOpenChange: (open: boolean) => void;
		currentRow?: Task | null;
	} = $props();

	const ctx = getTasksContext();
	const isUpdate = $derived(!!currentRow);

	const form = superForm(
		defaults(
			{
				title: '',
				status: '',
				label: '',
				priority: ''
			},
			zod4Client(taskFormSchema)
		),
		{
			SPA: true,
			validators: zod4Client(taskFormSchema),
			async onUpdate({ form: f }) {
				if (f.valid) {
					const validated = f.data as unknown as TaskFormData;
					const wasUpdate = isUpdate;
					onOpenChange(false);
					try {
						if (wasUpdate && currentRow) {
							await ctx.apply(
								(tasks) => tasks.map((t) => (t.id === currentRow.id ? { ...t, ...validated } : t)),
								() => simulateServer(null)
							);
						} else {
							const newTask: Task = {
								id: `TASK-${Math.floor(1000 + Math.random() * 9000)}`,
								...validated
							};
							await ctx.apply(
								(tasks) => [newTask, ...tasks],
								() => simulateServer(null)
							);
						}
						toast.success(wasUpdate ? m.tasks_toast_updated() : m.tasks_toast_created());
					} catch {
						toast.error(m.toast_action_failed());
					}
				}
			}
		}
	);

	const { form: formData, enhance, submitting } = form;

	// Populate form for edit, reset for create
	$effect(() => {
		if (currentRow) {
			form.reset({
				data: {
					title: currentRow.title,
					status: currentRow.status,
					label: currentRow.label,
					priority: currentRow.priority
				}
			});
		} else {
			form.reset({
				data: { title: '', status: '', label: '', priority: '' }
			});
		}
	});
</script>

<Sheet.Root
	bind:open
	onOpenChange={(v) => {
		if (!v) {
			onOpenChange(false);
			form.reset();
		}
	}}
>
	<Sheet.Content class="flex flex-col">
		<Sheet.Header class="text-start">
			<Sheet.Title
				>{isUpdate ? m.tasks_mutate_update_title() : m.tasks_mutate_create_title()}</Sheet.Title
			>
			<Sheet.Description>
				{isUpdate ? m.tasks_mutate_update_desc() : m.tasks_mutate_create_desc()}
				{m.tasks_mutate_save_instruction()}
			</Sheet.Description>
		</Sheet.Header>
		<form
			id="tasks-form"
			method="POST"
			use:enhance
			class="flex-1 space-y-5 overflow-y-auto px-4 pb-1"
		>
			<Form.Field {form} name="title">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>{m.tasks_col_title()}</Form.Label>
						<Input
							{...props}
							bind:value={$formData.title}
							placeholder={m.tasks_form_title_placeholder()}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="status">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>{m.tasks_col_status()}</Form.Label>
						<Select.Root
							type="single"
							value={$formData.status}
							onValueChange={(v) => {
								if (v) $formData.status = v;
							}}
						>
							<Select.Trigger {...props}>
								{statuses.find((s) => s.value === $formData.status)?.label ??
									m.tasks_form_select_status()}
							</Select.Trigger>
							<Select.Content>
								{#each statuses as status (status.value)}
									<Select.Item value={status.value}>
										{status.label}
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="label">
				<Form.Control>
					{#snippet children({ props: _props })}
						<Form.Label>{m.tasks_form_label()}</Form.Label>
						<RadioGroup.Root
							value={$formData.label}
							onValueChange={(v) => {
								if (v) $formData.label = v;
							}}
							class="flex flex-col space-y-1"
						>
							{#each labels as label (label.value)}
								<div class="flex items-center space-x-2">
									<RadioGroup.Item value={label.value} id="label-{label.value}" />
									<Label for="label-{label.value}" class="font-normal">
										{label.label}
									</Label>
								</div>
							{/each}
						</RadioGroup.Root>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="priority">
				<Form.Control>
					{#snippet children({ props: _props })}
						<Form.Label>{m.tasks_col_priority()}</Form.Label>
						<RadioGroup.Root
							value={$formData.priority}
							onValueChange={(v) => {
								if (v) $formData.priority = v;
							}}
							class="flex flex-col space-y-1"
						>
							{#each priorities as priority (priority.value)}
								<div class="flex items-center space-x-2">
									<RadioGroup.Item value={priority.value} id="priority-{priority.value}" />
									<Label for="priority-{priority.value}" class="font-normal">
										{priority.label}
									</Label>
								</div>
							{/each}
						</RadioGroup.Root>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</form>
		<Sheet.Footer class="gap-2">
			<Sheet.Close>
				{#snippet child({ props })}
					<Button {...props} variant="outline">{m.common_close()}</Button>
				{/snippet}
			</Sheet.Close>
			<Button form="tasks-form" type="submit" disabled={$submitting}>
				{m.common_save_changes()}
			</Button>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
