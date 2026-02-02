import type { Attachment } from 'svelte/attachments';

type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

interface TooltipOptions {
	side?: TooltipSide;
	delay?: number;
	sideOffset?: number;
}

const TOOLTIP_CLASS =
	'fixed z-50 rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground pointer-events-none animate-in fade-in-0 zoom-in-95';

function positionTooltip(
	reference: Element,
	el: HTMLElement,
	side: TooltipSide,
	offset: number
): void {
	const rect = reference.getBoundingClientRect();
	const tooltipRect = el.getBoundingClientRect();

	let top: number;
	let left: number;

	switch (side) {
		case 'top':
			top = rect.top - tooltipRect.height - offset;
			left = rect.left + rect.width / 2 - tooltipRect.width / 2;
			break;
		case 'bottom':
			top = rect.bottom + offset;
			left = rect.left + rect.width / 2 - tooltipRect.width / 2;
			break;
		case 'left':
			top = rect.top + rect.height / 2 - tooltipRect.height / 2;
			left = rect.left - tooltipRect.width - offset;
			break;
		case 'right':
			top = rect.top + rect.height / 2 - tooltipRect.height / 2;
			left = rect.right + offset;
			break;
	}

	// Clamp to viewport
	const vw = window.innerWidth;
	const vh = window.innerHeight;
	left = Math.max(4, Math.min(left, vw - tooltipRect.width - 4));
	top = Math.max(4, Math.min(top, vh - tooltipRect.height - 4));

	el.style.top = `${top}px`;
	el.style.left = `${left}px`;
}

/**
 * {@attach tooltip('Edit')}
 * {@attach tooltip(m.common_edit(), { side: 'top' })}
 */
export function tooltip(content: string, options?: TooltipOptions): Attachment<Element> {
	const side = options?.side ?? 'bottom';
	const delay = options?.delay ?? 300;
	const sideOffset = options?.sideOffset ?? 6;

	return (element: Element) => {
		let tooltipEl: HTMLDivElement | null = null;
		let timer: ReturnType<typeof setTimeout> | null = null;

		function show() {
			// Don't show if element has an open dropdown/popover
			if (element.getAttribute('data-state') === 'open') return;

			// Clear any pending timer to prevent duplicate tooltips
			if (timer) {
				clearTimeout(timer);
				timer = null;
			}

			if (tooltipEl) return;

			timer = setTimeout(() => {
				timer = null;
				if (element.getAttribute('data-state') === 'open') return;

				tooltipEl = document.createElement('div');
				tooltipEl.className = TOOLTIP_CLASS;
				tooltipEl.textContent = content;
				tooltipEl.setAttribute('role', 'tooltip');
				document.body.appendChild(tooltipEl);

				positionTooltip(element, tooltipEl, side, sideOffset);
			}, delay);
		}

		function hide() {
			if (timer) {
				clearTimeout(timer);
				timer = null;
			}
			if (tooltipEl) {
				tooltipEl.remove();
				tooltipEl = null;
			}
		}

		function handleFocusIn() {
			// Only show for keyboard-driven focus (Tab navigation).
			// Prevents stuck tooltips when focus returns programmatically
			// from closing dialogs, sheets, or dropdown menus.
			if (element.matches(':focus-visible')) {
				show();
			}
		}

		element.addEventListener('mouseenter', show);
		element.addEventListener('mouseleave', hide);
		element.addEventListener('focusin', handleFocusIn);
		element.addEventListener('focusout', hide);
		element.addEventListener('pointerdown', hide);

		return () => {
			hide();
			element.removeEventListener('mouseenter', show);
			element.removeEventListener('mouseleave', hide);
			element.removeEventListener('focusin', handleFocusIn);
			element.removeEventListener('focusout', hide);
			element.removeEventListener('pointerdown', hide);
		};
	};
}
