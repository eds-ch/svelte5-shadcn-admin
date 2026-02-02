import { faker } from '@faker-js/faker';
import type { Task } from './schema.js';

faker.seed(5);

const statusValues = ['backlog', 'todo', 'in progress', 'done', 'canceled'] as const;

const labelValues = ['bug', 'feature', 'documentation'] as const;

const priorityValues = ['low', 'medium', 'high', 'critical'] as const;

export const tasks: Task[] = Array.from({ length: 100 }, () => ({
	id: `TASK-${faker.number.int({ min: 1000, max: 9999 })}`,
	title: faker.hacker.phrase().replace(/^./, (letter: string) => letter.toUpperCase()),
	status: faker.helpers.arrayElement(statusValues),
	label: faker.helpers.arrayElement(labelValues),
	priority: faker.helpers.arrayElement(priorityValues)
}));
