<script lang="ts">
	import MailPlusIcon from '@lucide/svelte/icons/mail-plus';
	import UserPlusIcon from '@lucide/svelte/icons/user-plus';
	import { Button } from '$lib/components/ui/button/index.js';
	import { getUsersContext } from '../context.js';
	import { m } from '$lib/paraglide/messages.js';

	const ctx = getUsersContext();
</script>

<div class="flex gap-2">
	<Button variant="outline" class="space-x-1" onclick={() => ctx.openDialog('invite')}>
		<span>{m.users_invite_user()}</span>
		<MailPlusIcon class="size-[18px]" />
	</Button>
	<Button class="space-x-1" onclick={() => ctx.openDialog('add')}>
		<span>{m.users_add_user()}</span>
		<UserPlusIcon class="size-[18px]" />
	</Button>
</div>
