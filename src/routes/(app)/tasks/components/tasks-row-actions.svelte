<script lang="ts">
	import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import type { Row } from '@tanstack/table-core';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { toast } from 'svelte-sonner';
	import { simulateServer } from '$lib/utils/simulate-server.js';
	import { getLabels, getStatuses, getPriorities } from '../data/data.js';
	import {
		taskSchema,
		type Task,
		type TaskLabel,
		type TaskStatus,
		type TaskPriority
	} from '../data/schema.js';
	import { getTasksContext } from '../context.js';
	import { m } from '$lib/paraglide/messages.js';
	import { tooltip } from '$lib/attachments/tooltip';

	const labels = getLabels();
	const statuses = getStatuses();
	const priorities = getPriorities();

	let { row }: { row: Row<Task> } = $props();

	const ctx = getTasksContext();
	const task = $derived(taskSchema.parse(row.original));

	async function handleLabelChange(newLabel: string | undefined) {
		if (!newLabel) return;
		try {
			await ctx.apply(
				(tasks) =>
					tasks.map((t) => (t.id === task.id ? { ...t, label: newLabel as TaskLabel } : t)),
				() => simulateServer(null)
			);
		} catch {
			toast.error(m.toast_action_failed());
		}
	}

	async function handleStatusChange(newStatus: string | undefined) {
		if (!newStatus) return;
		try {
			await ctx.apply(
				(tasks) =>
					tasks.map((t) => (t.id === task.id ? { ...t, status: newStatus as TaskStatus } : t)),
				() => simulateServer(null)
			);
		} catch {
			toast.error(m.toast_action_failed());
		}
	}

	async function handlePriorityChange(newPriority: string | undefined) {
		if (!newPriority) return;
		try {
			await ctx.apply(
				(tasks) =>
					tasks.map((t) =>
						t.id === task.id ? { ...t, priority: newPriority as TaskPriority } : t
					),
				() => simulateServer(null)
			);
		} catch {
			toast.error(m.toast_action_failed());
		}
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				{@attach tooltip(m.common_open_menu())}
				variant="ghost"
				class="data-[state=open]:bg-muted flex h-8 w-8 p-0"
			>
				<EllipsisIcon class="size-4" />
				<span class="sr-only">{m.common_open_menu()}</span>
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-[160px]" align="end">
		<DropdownMenu.Item
			onclick={() => {
				ctx.openDialog('update', task);
			}}
		>
			{m.common_edit()}
		</DropdownMenu.Item>
		<DropdownMenu.Item
			onclick={() => {
				navigator.clipboard.writeText(task.id);
				toast.success(m.tasks_toast_id_copied());
			}}
		>
			{m.tasks_row_copy_id()}
		</DropdownMenu.Item>
		<DropdownMenu.Item disabled>{m.tasks_row_favorite()}</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Sub>
			<DropdownMenu.SubTrigger>{m.tasks_row_labels()}</DropdownMenu.SubTrigger>
			<DropdownMenu.SubContent>
				<DropdownMenu.RadioGroup value={task.label} onValueChange={handleLabelChange}>
					{#each labels as label (label.value)}
						<DropdownMenu.RadioItem value={label.value}>
							{label.label}
						</DropdownMenu.RadioItem>
					{/each}
				</DropdownMenu.RadioGroup>
			</DropdownMenu.SubContent>
		</DropdownMenu.Sub>
		<DropdownMenu.Sub>
			<DropdownMenu.SubTrigger>{m.tasks_col_status()}</DropdownMenu.SubTrigger>
			<DropdownMenu.SubContent>
				<DropdownMenu.RadioGroup value={task.status} onValueChange={handleStatusChange}>
					{#each statuses as status (status.value)}
						<DropdownMenu.RadioItem value={status.value}>
							{status.label}
						</DropdownMenu.RadioItem>
					{/each}
				</DropdownMenu.RadioGroup>
			</DropdownMenu.SubContent>
		</DropdownMenu.Sub>
		<DropdownMenu.Sub>
			<DropdownMenu.SubTrigger>{m.tasks_col_priority()}</DropdownMenu.SubTrigger>
			<DropdownMenu.SubContent>
				<DropdownMenu.RadioGroup value={task.priority} onValueChange={handlePriorityChange}>
					{#each priorities as priority (priority.value)}
						<DropdownMenu.RadioItem value={priority.value}>
							{priority.label}
						</DropdownMenu.RadioItem>
					{/each}
				</DropdownMenu.RadioGroup>
			</DropdownMenu.SubContent>
		</DropdownMenu.Sub>
		<DropdownMenu.Separator />
		<DropdownMenu.Item
			onclick={() => {
				ctx.openDialog('delete', task);
			}}
		>
			{m.common_delete()}
			<DropdownMenu.Shortcut>
				<Trash2Icon class="size-4" />
			</DropdownMenu.Shortcut>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
