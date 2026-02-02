import { createContext } from 'svelte';
import { COOKIE } from '$lib/config';

export type Collapsible = 'offcanvas' | 'icon' | 'none';
export type Variant = 'inset' | 'sidebar' | 'floating';

export class LayoutState {
	readonly defaultCollapsible: Collapsible = COOKIE.defaults.collapsible;
	readonly defaultVariant: Variant = COOKIE.defaults.variant;

	collapsible: Collapsible = $state(COOKIE.defaults.collapsible);
	variant: Variant = $state(COOKIE.defaults.variant);

	static readonly validCollapsibles: Collapsible[] = ['offcanvas', 'icon', 'none'];
	static readonly validVariants: Variant[] = ['inset', 'sidebar', 'floating'];

	constructor(initial: { collapsible: string; variant: string }) {
		this.collapsible = LayoutState.validCollapsibles.includes(initial.collapsible as Collapsible)
			? (initial.collapsible as Collapsible)
			: this.defaultCollapsible;
		this.variant = LayoutState.validVariants.includes(initial.variant as Variant)
			? (initial.variant as Variant)
			: this.defaultVariant;
	}

	setCollapsible = (value: Collapsible) => {
		this.collapsible = value;
		document.cookie = `${COOKIE.layoutCollapsible}=${value}; path=/; max-age=${COOKIE.maxAge.short}; SameSite=Lax`;
	};

	setVariant = (value: Variant) => {
		this.variant = value;
		document.cookie = `${COOKIE.layoutVariant}=${value}; path=/; max-age=${COOKIE.maxAge.short}; SameSite=Lax`;
	};

	reset = () => {
		this.setCollapsible(this.defaultCollapsible);
		this.setVariant(this.defaultVariant);
	};
}

export const [getLayout, setLayout] = createContext<LayoutState>();
