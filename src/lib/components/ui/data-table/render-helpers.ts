import type { Component, ComponentProps, Snippet } from 'svelte';

/** @internal Used by FlexRender to identify component configs. */
export class RenderComponentConfig<TComponent extends Component> {
	component: TComponent;
	props: ComponentProps<TComponent> | Record<string, never>;
	constructor(
		component: TComponent,
		props: ComponentProps<TComponent> | Record<string, never> = {}
	) {
		this.component = component;
		this.props = props;
	}
}

/** @internal Used by FlexRender to identify snippet configs. */
export class RenderSnippetConfig<TProps> {
	snippet: Snippet<[TProps]>;
	params: TProps;
	constructor(snippet: Snippet<[TProps]>, params: TProps) {
		this.snippet = snippet;
		this.params = params;
	}
}

/**
 * Wraps a Svelte component for use in `columnDef.cell` / `columnDef.header`.
 * For snippets use `renderSnippet`.
 *
 * @see {@link https://tanstack.com/table/latest/docs/guide/column-defs}
 */
export function renderComponent<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	T extends Component<any>,
	Props extends ComponentProps<T>
>(component: T, props: Props = {} as Props) {
	return new RenderComponentConfig(component, props);
}

/**
 * Wraps a Svelte snippet for use in `columnDef.cell` / `columnDef.header`.
 * Snippet must accept exactly one parameter. For components use `renderComponent`.
 *
 * @see {@link https://tanstack.com/table/latest/docs/guide/column-defs}
 */
export function renderSnippet<TProps>(snippet: Snippet<[TProps]>, params: TProps = {} as TProps) {
	return new RenderSnippetConfig(snippet, params);
}
