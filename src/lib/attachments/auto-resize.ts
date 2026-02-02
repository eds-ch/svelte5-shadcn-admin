import type { Attachment } from 'svelte/attachments';

interface AutoResizeOptions {
	maxHeight?: number;
}

export function autoResize(options?: AutoResizeOptions): Attachment<HTMLTextAreaElement> {
	const maxHeight = options?.maxHeight ?? 200;

	return (element: HTMLTextAreaElement) => {
		element.style.overflow = 'hidden';

		function resize() {
			element.style.height = 'auto';
			const clamped = Math.min(element.scrollHeight, maxHeight);
			element.style.height = `${clamped}px`;
			element.style.overflow = element.scrollHeight > maxHeight ? 'auto' : 'hidden';
		}

		resize();

		element.addEventListener('input', resize);

		return () => {
			element.removeEventListener('input', resize);
		};
	};
}
