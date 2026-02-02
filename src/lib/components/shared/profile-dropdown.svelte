<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import SignOutDialog from '$lib/components/layout/sign-out-dialog.svelte';
	import { localizeHref } from '$lib/paraglide/runtime.js';
	import { m } from '$lib/paraglide/messages.js';
	import { getAppData } from '$lib/contexts/app.svelte';

	let signOutOpen = $state(false);

	const { currentUser: user } = getAppData();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="ghost"
				class="relative h-8 w-8 rounded-full"
				aria-label={m.profile_menu_aria_open()}
			>
				<Avatar.Root class="h-8 w-8">
					<Avatar.Image src={user.avatar} alt={user.name} />
					<Avatar.Fallback>{user.name.slice(0, 2).toUpperCase()}</Avatar.Fallback>
				</Avatar.Root>
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56" align="end">
		<DropdownMenu.Label class="font-normal">
			<div class="flex flex-col gap-1.5">
				<p class="text-sm leading-none font-medium">{user.name}</p>
				<p class="text-muted-foreground text-xs leading-none">{user.email}</p>
			</div>
		</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<DropdownMenu.Item>
				{#snippet child({ props })}
					<a href={localizeHref('/settings')} {...props}>
						{m.profile_menu_profile()}
						<DropdownMenu.Shortcut>&#8679;&#8984;P</DropdownMenu.Shortcut>
					</a>
				{/snippet}
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				{#snippet child({ props })}
					<a href={localizeHref('/settings/account')} {...props}>
						{m.user_billing()}
						<DropdownMenu.Shortcut>&#8984;B</DropdownMenu.Shortcut>
					</a>
				{/snippet}
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				{#snippet child({ props })}
					<a href={localizeHref('/settings/appearance')} {...props}>
						{m.profile_menu_settings()}
						<DropdownMenu.Shortcut>&#8984;S</DropdownMenu.Shortcut>
					</a>
				{/snippet}
			</DropdownMenu.Item>
			<DropdownMenu.Item>{m.profile_menu_new_team()}</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item variant="destructive" onclick={() => (signOutOpen = true)}>
			{m.common_sign_out()}
			<DropdownMenu.Shortcut class="text-current">&#8679;&#8984;Q</DropdownMenu.Shortcut>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<SignOutDialog bind:open={signOutOpen} />
