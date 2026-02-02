import { m } from '$lib/paraglide/messages.js';
import Bell from '@lucide/svelte/icons/bell';
import Bug from '@lucide/svelte/icons/bug';
import CircleHelp from '@lucide/svelte/icons/circle-help';
import Construction from '@lucide/svelte/icons/construction';
import FileX from '@lucide/svelte/icons/file-x';
import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
import ListTodo from '@lucide/svelte/icons/list-todo';
import Lock from '@lucide/svelte/icons/lock';
import MessagesSquare from '@lucide/svelte/icons/messages-square';
import Monitor from '@lucide/svelte/icons/monitor';
import Package from '@lucide/svelte/icons/package';
import Palette from '@lucide/svelte/icons/palette';
import ServerOff from '@lucide/svelte/icons/server-off';
import Settings from '@lucide/svelte/icons/settings';
import ShieldCheck from '@lucide/svelte/icons/shield-check';
import UserCog from '@lucide/svelte/icons/user-cog';
import UserX from '@lucide/svelte/icons/user-x';
import Users from '@lucide/svelte/icons/users';
import Wrench from '@lucide/svelte/icons/wrench';
import type { NavGroup } from './types';

export function getNavGroups(): NavGroup[] {
	return [
		{
			title: m.nav_group_general(),
			items: [
				{
					title: m.nav_dashboard(),
					url: '/',
					icon: LayoutDashboard
				},
				{
					title: m.nav_tasks(),
					url: '/tasks',
					icon: ListTodo
				},
				{
					title: m.nav_apps(),
					url: '/apps',
					icon: Package
				},
				{
					title: m.nav_chats(),
					url: '/chats',
					badge: '3',
					icon: MessagesSquare
				},
				{
					title: m.nav_users(),
					url: '/users',
					icon: Users
				}
			]
		},
		{
			title: m.nav_group_pages(),
			items: [
				{
					title: m.nav_auth(),
					icon: ShieldCheck,
					items: [
						{
							title: m.nav_sign_in(),
							url: '/sign-in'
						},
						{
							title: m.nav_sign_in_2col(),
							url: '/sign-in-2'
						},
						{
							title: m.nav_sign_up(),
							url: '/sign-up'
						},
						{
							title: m.nav_forgot_password(),
							url: '/forgot-password'
						},
						{
							title: m.nav_otp(),
							url: '/otp'
						}
					]
				},
				{
					title: m.nav_errors(),
					icon: Bug,
					items: [
						{
							title: m.nav_unauthorized(),
							url: '/errors/unauthorized',
							icon: Lock
						},
						{
							title: m.nav_forbidden(),
							url: '/errors/forbidden',
							icon: UserX
						},
						{
							title: m.nav_not_found(),
							url: '/errors/not-found',
							icon: FileX
						},
						{
							title: m.nav_internal_server_error(),
							url: '/errors/internal-server-error',
							icon: ServerOff
						},
						{
							title: m.nav_maintenance_error(),
							url: '/errors/maintenance-error',
							icon: Construction
						}
					]
				}
			]
		},
		{
			title: m.nav_group_other(),
			items: [
				{
					title: m.nav_settings(),
					icon: Settings,
					items: [
						{
							title: m.nav_profile(),
							url: '/settings',
							icon: UserCog
						},
						{
							title: m.nav_account(),
							url: '/settings/account',
							icon: Wrench
						},
						{
							title: m.nav_appearance(),
							url: '/settings/appearance',
							icon: Palette
						},
						{
							title: m.nav_notifications(),
							url: '/settings/notifications',
							icon: Bell
						},
						{
							title: m.nav_display(),
							url: '/settings/display',
							icon: Monitor
						}
					]
				},
				{
					title: m.nav_help_center(),
					url: '/help-center',
					icon: CircleHelp
				}
			]
		}
	];
}
