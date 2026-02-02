import AudioWaveform from '@lucide/svelte/icons/audio-waveform';
import GalleryVerticalEnd from '@lucide/svelte/icons/gallery-vertical-end';
import Zap from '@lucide/svelte/icons/zap';
import type { User, Team } from '$lib/data/types';
import { getAvatarUrl } from '$lib/utils/avatar';
import { APP_NAME } from '$lib/config';

export const currentUser: User = {
	name: 'Kira Mosley',
	email: 'kira@vortexhq.io',
	avatar: getAvatarUrl('kira-mosley')
};

export const teams: Team[] = [
	{
		name: APP_NAME,
		logo: Zap,
		plan: 'SaaS Analytics'
	},
	{
		name: 'Meridian Labs',
		logo: GalleryVerticalEnd,
		plan: 'Enterprise'
	},
	{
		name: 'Helix Ops',
		logo: AudioWaveform,
		plan: 'Startup'
	}
];
