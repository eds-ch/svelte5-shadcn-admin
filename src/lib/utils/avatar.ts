export function getAvatarUrl(seed: string): string {
	const filename = seed.toLowerCase().replace(/\s+/g, '-');
	return `/avatars/${filename}.svg`;
}
