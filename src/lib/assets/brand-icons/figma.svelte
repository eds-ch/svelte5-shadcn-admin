<script lang="ts">
	let { class: className = '' }: { class?: string } = $props();
</script>

<svg
	role="img"
	viewBox="0 0 24 24"
	xmlns="http://www.w3.org/2000/svg"
	width="24"
	height="24"
	class={className}
	fill="none"
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
>
	<title>Figma</title>
	<path stroke-width="0" d="M0 0h24v24H0z" fill="none" />
	<path d="M15 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
	<path d="M6 3m0 3a3 3 0 0 1 3 -3h6a3 3 0 0 1 3 3v0a3 3 0 0 1 -3 3h-6a3 3 0 0 1 -3 -3z" />
	<path d="M9 9a3 3 0 0 0 0 6h3m-3 0a3 3 0 1 0 3 3v-15" />
</svg>
