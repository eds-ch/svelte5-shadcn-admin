<script lang="ts">
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import type { Row } from '@tanstack/table-core';
	import * as ContextMenu from '$lib/components/ui/context-menu/index.js';
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

<ContextMenu.Content class="w-[160px]">
	<ContextMenu.Item onclick={() => ctx.openDialog('update', task)}>
		{m.common_edit()}
	</ContextMenu.Item>
	<ContextMenu.Item
		onclick={() => {
			navigator.clipboard.writeText(task.id);
			toast.success(m.tasks_toast_id_copied());
		}}
	>
		{m.tasks_row_copy_id()}
	</ContextMenu.Item>
	<ContextMenu.Item disabled>{m.tasks_row_favorite()}</ContextMenu.Item>
	<ContextMenu.Separator />
	<ContextMenu.Sub>
		<ContextMenu.SubTrigger>{m.tasks_row_labels()}</ContextMenu.SubTrigger>
		<ContextMenu.SubContent>
			<ContextMenu.RadioGroup value={task.label} onValueChange={handleLabelChange}>
				{#each labels as label (label.value)}
					<ContextMenu.RadioItem value={label.value}>
						{label.label}
					</ContextMenu.RadioItem>
				{/each}
			</ContextMenu.RadioGroup>
		</ContextMenu.SubContent>
	</ContextMenu.Sub>
	<ContextMenu.Sub>
		<ContextMenu.SubTrigger>{m.tasks_col_status()}</ContextMenu.SubTrigger>
		<ContextMenu.SubContent>
			<ContextMenu.RadioGroup value={task.status} onValueChange={handleStatusChange}>
				{#each statuses as status (status.value)}
					<ContextMenu.RadioItem value={status.value}>
						{status.label}
					</ContextMenu.RadioItem>
				{/each}
			</ContextMenu.RadioGroup>
		</ContextMenu.SubContent>
	</ContextMenu.Sub>
	<ContextMenu.Sub>
		<ContextMenu.SubTrigger>{m.tasks_col_priority()}</ContextMenu.SubTrigger>
		<ContextMenu.SubContent>
			<ContextMenu.RadioGroup value={task.priority} onValueChange={handlePriorityChange}>
				{#each priorities as priority (priority.value)}
					<ContextMenu.RadioItem value={priority.value}>
						{priority.label}
					</ContextMenu.RadioItem>
				{/each}
			</ContextMenu.RadioGroup>
		</ContextMenu.SubContent>
	</ContextMenu.Sub>
	<ContextMenu.Separator />
	<ContextMenu.Item variant="destructive" onclick={() => ctx.openDialog('delete', task)}>
		{m.common_delete()}
		<ContextMenu.Shortcut>
			<Trash2Icon class="size-4" />
		</ContextMenu.Shortcut>
	</ContextMenu.Item>
</ContextMenu.Content>
