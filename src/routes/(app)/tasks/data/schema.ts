import { z } from 'zod';
import { m } from '$lib/paraglide/messages.js';

const taskStatusSchema = z.union([
	z.literal('backlog'),
	z.literal('todo'),
	z.literal('in progress'),
	z.literal('done'),
	z.literal('canceled')
]);
export type TaskStatus = z.infer<typeof taskStatusSchema>;

const taskLabelSchema = z.union([
	z.literal('bug'),
	z.literal('feature'),
	z.literal('documentation')
]);
export type TaskLabel = z.infer<typeof taskLabelSchema>;

const taskPrioritySchema = z.union([
	z.literal('low'),
	z.literal('medium'),
	z.literal('high'),
	z.literal('critical')
]);
export type TaskPriority = z.infer<typeof taskPrioritySchema>;

export const taskSchema = z.object({
	id: z.string(),
	title: z.string(),
	status: taskStatusSchema,
	label: taskLabelSchema,
	priority: taskPrioritySchema
});

export type Task = z.infer<typeof taskSchema>;

export function getTaskFormSchema() {
	return z.object({
		title: z.string().min(1, m.validation_title_required()),
		status: taskStatusSchema,
		label: taskLabelSchema,
		priority: taskPrioritySchema
	});
}

export type TaskFormData = z.infer<ReturnType<typeof getTaskFormSchema>>;
