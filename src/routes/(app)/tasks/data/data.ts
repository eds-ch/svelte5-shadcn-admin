import type { Component } from 'svelte';
import ArrowDownIcon from '@lucide/svelte/icons/arrow-down';
import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
import CircleIcon from '@lucide/svelte/icons/circle';
import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
import CircleXIcon from '@lucide/svelte/icons/circle-x';
import CircleHelpIcon from '@lucide/svelte/icons/circle-help';
import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';
import TimerIcon from '@lucide/svelte/icons/timer';
import { m } from '$lib/paraglide/messages.js';

export function getLabels(): { value: string; label: string }[] {
	return [
		{ value: 'bug', label: m.tasks_label_bug() },
		{ value: 'feature', label: m.tasks_label_feature() },
		{ value: 'documentation', label: m.tasks_label_documentation() }
	];
}

export function getStatuses(): { value: string; label: string; icon: Component }[] {
	return [
		{ label: m.tasks_status_backlog(), value: 'backlog', icon: CircleHelpIcon },
		{ label: m.tasks_status_todo(), value: 'todo', icon: CircleIcon },
		{ label: m.tasks_status_in_progress(), value: 'in progress', icon: TimerIcon },
		{ label: m.tasks_status_done(), value: 'done', icon: CircleCheckIcon },
		{ label: m.tasks_status_canceled(), value: 'canceled', icon: CircleXIcon }
	];
}

export function getPriorities(): { value: string; label: string; icon: Component }[] {
	return [
		{ label: m.tasks_priority_low(), value: 'low', icon: ArrowDownIcon },
		{ label: m.tasks_priority_medium(), value: 'medium', icon: ArrowRightIcon },
		{ label: m.tasks_priority_high(), value: 'high', icon: ArrowUpIcon },
		{ label: m.tasks_priority_critical(), value: 'critical', icon: CircleAlertIcon }
	];
}
