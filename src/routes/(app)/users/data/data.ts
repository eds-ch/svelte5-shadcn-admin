import ShieldCheckIcon from '@lucide/svelte/icons/shield-check';
import UserCogIcon from '@lucide/svelte/icons/user-cog';
import BriefcaseIcon from '@lucide/svelte/icons/briefcase';
import DollarSignIcon from '@lucide/svelte/icons/dollar-sign';
import type { Component } from 'svelte';
import type { UserStatus } from './schema.js';
import { m } from '$lib/paraglide/messages.js';

export const statusBadgeStyles = new Map<UserStatus, string>([
	['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
	['inactive', 'bg-neutral-300/40 border-neutral-300'],
	['invited', 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300'],
	[
		'suspended',
		'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10'
	]
]);

export function getRoles(): { label: string; value: string; icon: Component }[] {
	return [
		{ label: m.users_role_superadmin(), value: 'superadmin', icon: ShieldCheckIcon },
		{ label: m.users_role_admin(), value: 'admin', icon: UserCogIcon },
		{ label: m.users_role_manager(), value: 'manager', icon: BriefcaseIcon },
		{ label: m.users_role_cashier(), value: 'cashier', icon: DollarSignIcon }
	];
}

export function getUserStatuses(): { label: string; value: string }[] {
	return [
		{ label: m.users_status_active(), value: 'active' },
		{ label: m.users_status_inactive(), value: 'inactive' },
		{ label: m.users_status_invited(), value: 'invited' },
		{ label: m.users_status_suspended(), value: 'suspended' }
	];
}
