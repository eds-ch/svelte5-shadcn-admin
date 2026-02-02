import type { Attachment } from 'svelte/attachments';

interface WhenVisibleOptions {
	once?: boolean;
	threshold?: number;
	rootMargin?: string;
}

export function whenVisible(
	callback: () => void,
	options?: WhenVisibleOptions
): Attachment<Element> {
	const once = options?.once ?? true;
	const threshold = options?.threshold ?? 0;
	const rootMargin = options?.rootMargin ?? '0px';

	return (element: Element) => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						callback();
						if (once) {
							observer.disconnect();
						}
					}
				}
			},
			{ threshold, rootMargin }
		);

		observer.observe(element);

		return () => {
			observer.disconnect();
		};
	};
}
