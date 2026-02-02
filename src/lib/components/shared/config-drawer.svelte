<script lang="ts">
	import Settings from '@lucide/svelte/icons/settings';
	import CircleCheck from '@lucide/svelte/icons/circle-check';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';
	import { useSidebar } from '$lib/components/ui/sidebar';
	import { getLayout, type Collapsible, type Variant } from '$lib/contexts/layout.svelte';
	import { getTheme } from '$lib/contexts/theme.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { presets } from '$lib/themes/preset-data';
	import PresetSwatch from '$lib/components/shared/preset-swatch.svelte';
	import { tooltip } from '$lib/attachments/tooltip';

	const layout = getLayout();
	const theme = getTheme();
	const sidebar = useSidebar();

	let open = $state(false);

	function handleReset() {
		sidebar.setOpen(true);
		layout.reset();
		theme.reset();
	}

	const themeOptions: { value: 'system' | 'light' | 'dark'; label: string }[] = [
		{ value: 'light', label: m.common_theme_light() },
		{ value: 'dark', label: m.common_theme_dark() },
		{ value: 'system', label: m.common_theme_system() }
	];

	const variantOptions: { value: Variant; label: string }[] = [
		{ value: 'inset', label: m.config_sidebar_inset() },
		{ value: 'floating', label: m.config_sidebar_floating() },
		{ value: 'sidebar', label: m.config_sidebar_sidebar() }
	];

	const layoutOptions: { value: string; label: string }[] = [
		{ value: 'default', label: m.config_layout_default() },
		{ value: 'icon', label: m.config_layout_compact() },
		{ value: 'offcanvas', label: m.config_layout_full() }
	];

	let layoutRadioState = $derived(sidebar.open ? 'default' : layout.collapsible);

	function handleLayoutChange(value: string) {
		if (value === 'default') {
			sidebar.setOpen(true);
		} else {
			sidebar.setOpen(false);
			layout.setCollapsible(value as Collapsible);
		}
	}
</script>

{#snippet themePreviewLight()}
	<svg viewBox="0 0 100 70" class="w-full" aria-hidden="true">
		<rect width="100" height="70" fill="#f4f4f5" />
		<rect x="0" y="0" width="24" height="70" fill="#ffffff" stroke="#e4e4e7" stroke-width="0.5" />
		<rect x="4" y="6" width="16" height="3" rx="1" fill="#a1a1aa" />
		<rect x="4" y="13" width="12" height="2" rx="1" fill="#e4e4e7" />
		<rect x="4" y="18" width="14" height="2" rx="1" fill="#e4e4e7" />
		<rect x="4" y="23" width="10" height="2" rx="1" fill="#e4e4e7" />
		<rect x="28" y="6" width="40" height="4" rx="1" fill="#e4e4e7" />
		<rect
			x="28"
			y="14"
			width="68"
			height="20"
			rx="2"
			fill="#ffffff"
			stroke="#e4e4e7"
			stroke-width="0.5"
		/>
		<rect
			x="28"
			y="38"
			width="68"
			height="20"
			rx="2"
			fill="#ffffff"
			stroke="#e4e4e7"
			stroke-width="0.5"
		/>
	</svg>
{/snippet}

{#snippet themePreviewDark()}
	<svg viewBox="0 0 100 70" class="w-full" aria-hidden="true">
		<rect width="100" height="70" fill="#09090b" />
		<rect x="0" y="0" width="24" height="70" fill="#18181b" stroke="#27272a" stroke-width="0.5" />
		<rect x="4" y="6" width="16" height="3" rx="1" fill="#52525b" />
		<rect x="4" y="13" width="12" height="2" rx="1" fill="#3f3f46" />
		<rect x="4" y="18" width="14" height="2" rx="1" fill="#3f3f46" />
		<rect x="4" y="23" width="10" height="2" rx="1" fill="#3f3f46" />
		<rect x="28" y="6" width="40" height="4" rx="1" fill="#3f3f46" />
		<rect
			x="28"
			y="14"
			width="68"
			height="20"
			rx="2"
			fill="#18181b"
			stroke="#27272a"
			stroke-width="0.5"
		/>
		<rect
			x="28"
			y="38"
			width="68"
			height="20"
			rx="2"
			fill="#18181b"
			stroke="#27272a"
			stroke-width="0.5"
		/>
	</svg>
{/snippet}

{#snippet themePreviewSystem()}
	<svg viewBox="0 0 100 70" class="w-full" aria-hidden="true">
		<defs>
			<clipPath id="config-clip-left">
				<rect x="0" y="0" width="50" height="70" />
			</clipPath>
			<clipPath id="config-clip-right">
				<rect x="50" y="0" width="50" height="70" />
			</clipPath>
		</defs>
		<g clip-path="url(#config-clip-left)">
			<rect width="100" height="70" fill="#f4f4f5" />
			<rect x="0" y="0" width="24" height="70" fill="#ffffff" stroke="#e4e4e7" stroke-width="0.5" />
			<rect x="4" y="6" width="16" height="3" rx="1" fill="#a1a1aa" />
			<rect x="4" y="13" width="12" height="2" rx="1" fill="#e4e4e7" />
			<rect x="4" y="18" width="14" height="2" rx="1" fill="#e4e4e7" />
			<rect x="4" y="23" width="10" height="2" rx="1" fill="#e4e4e7" />
			<rect x="28" y="6" width="40" height="4" rx="1" fill="#e4e4e7" />
			<rect
				x="28"
				y="14"
				width="68"
				height="20"
				rx="2"
				fill="#ffffff"
				stroke="#e4e4e7"
				stroke-width="0.5"
			/>
			<rect
				x="28"
				y="38"
				width="68"
				height="20"
				rx="2"
				fill="#ffffff"
				stroke="#e4e4e7"
				stroke-width="0.5"
			/>
		</g>
		<g clip-path="url(#config-clip-right)">
			<rect width="100" height="70" fill="#09090b" />
			<rect x="0" y="0" width="24" height="70" fill="#18181b" stroke="#27272a" stroke-width="0.5" />
			<rect x="4" y="6" width="16" height="3" rx="1" fill="#52525b" />
			<rect x="4" y="13" width="12" height="2" rx="1" fill="#3f3f46" />
			<rect x="4" y="18" width="14" height="2" rx="1" fill="#3f3f46" />
			<rect x="4" y="23" width="10" height="2" rx="1" fill="#3f3f46" />
			<rect x="28" y="6" width="40" height="4" rx="1" fill="#3f3f46" />
			<rect
				x="28"
				y="14"
				width="68"
				height="20"
				rx="2"
				fill="#18181b"
				stroke="#27272a"
				stroke-width="0.5"
			/>
			<rect
				x="28"
				y="38"
				width="68"
				height="20"
				rx="2"
				fill="#18181b"
				stroke="#27272a"
				stroke-width="0.5"
			/>
		</g>
	</svg>
{/snippet}

{#snippet sidebarPreview(variant: string)}
	<svg viewBox="0 0 100 70" class="w-full" aria-hidden="true">
		{#if variant === 'inset'}
			<rect width="100" height="70" class="fill-muted" />
			<rect
				x="2"
				y="2"
				width="22"
				height="66"
				rx="4"
				class="fill-primary/20 stroke-primary"
				stroke-width="0.5"
			/>
			<rect x="5" y="6" width="16" height="3" rx="1" class="fill-primary" />
			<rect x="5" y="13" width="12" height="2" rx="1" class="fill-primary/40" />
			<rect x="5" y="18" width="14" height="2" rx="1" class="fill-primary/40" />
			<rect
				x="28"
				y="4"
				width="68"
				height="62"
				rx="4"
				class="fill-background stroke-border"
				stroke-width="0.5"
			/>
		{:else if variant === 'floating'}
			<rect width="100" height="70" class="fill-background" />
			<rect
				x="4"
				y="4"
				width="20"
				height="62"
				rx="4"
				class="fill-primary/20 stroke-primary"
				stroke-width="0.5"
			/>
			<rect x="7" y="8" width="14" height="3" rx="1" class="fill-primary" />
			<rect x="7" y="15" width="10" height="2" rx="1" class="fill-primary/40" />
			<rect x="7" y="20" width="12" height="2" rx="1" class="fill-primary/40" />
			<rect x="28" y="6" width="40" height="4" rx="1" class="fill-muted-foreground/20" />
			<rect
				x="28"
				y="14"
				width="68"
				height="20"
				rx="2"
				class="fill-muted/50 stroke-border"
				stroke-width="0.5"
			/>
		{:else}
			<rect width="100" height="70" class="fill-background" />
			<rect
				x="0"
				y="0"
				width="24"
				height="70"
				class="fill-primary/20 stroke-primary"
				stroke-width="0.5"
			/>
			<rect x="4" y="6" width="16" height="3" rx="1" class="fill-primary" />
			<rect x="4" y="13" width="12" height="2" rx="1" class="fill-primary/40" />
			<rect x="4" y="18" width="14" height="2" rx="1" class="fill-primary/40" />
			<rect x="28" y="6" width="40" height="4" rx="1" class="fill-muted-foreground/20" />
			<rect
				x="28"
				y="14"
				width="68"
				height="20"
				rx="2"
				class="fill-muted/50 stroke-border"
				stroke-width="0.5"
			/>
		{/if}
	</svg>
{/snippet}

{#snippet layoutPreview(mode: string)}
	<svg viewBox="0 0 100 70" class="w-full" aria-hidden="true">
		{#if mode === 'default'}
			<rect width="100" height="70" class="fill-background" />
			<rect
				x="0"
				y="0"
				width="24"
				height="70"
				class="fill-primary/20 stroke-primary"
				stroke-width="0.5"
			/>
			<rect x="4" y="6" width="16" height="3" rx="1" class="fill-primary" />
			<rect x="4" y="13" width="12" height="2" rx="1" class="fill-primary/40" />
			<rect x="4" y="18" width="14" height="2" rx="1" class="fill-primary/40" />
			<rect x="4" y="23" width="10" height="2" rx="1" class="fill-primary/40" />
			<rect x="28" y="6" width="40" height="4" rx="1" class="fill-muted-foreground/20" />
			<rect
				x="28"
				y="14"
				width="68"
				height="20"
				rx="2"
				class="fill-muted/50 stroke-border"
				stroke-width="0.5"
			/>
		{:else if mode === 'icon'}
			<rect width="100" height="70" class="fill-background" />
			<rect
				x="0"
				y="0"
				width="10"
				height="70"
				class="fill-primary/20 stroke-primary"
				stroke-width="0.5"
			/>
			<rect x="2" y="6" width="6" height="6" rx="1" class="fill-primary/40" />
			<rect x="2" y="16" width="6" height="6" rx="1" class="fill-primary/40" />
			<rect x="2" y="26" width="6" height="6" rx="1" class="fill-primary/40" />
			<rect x="14" y="6" width="40" height="4" rx="1" class="fill-muted-foreground/20" />
			<rect
				x="14"
				y="14"
				width="82"
				height="20"
				rx="2"
				class="fill-muted/50 stroke-border"
				stroke-width="0.5"
			/>
		{:else}
			<rect width="100" height="70" class="fill-background" />
			<rect x="4" y="6" width="40" height="4" rx="1" class="fill-muted-foreground/20" />
			<rect
				x="4"
				y="14"
				width="92"
				height="20"
				rx="2"
				class="fill-muted/50 stroke-border"
				stroke-width="0.5"
			/>
			<rect
				x="4"
				y="38"
				width="92"
				height="20"
				rx="2"
				class="fill-muted/50 stroke-border"
				stroke-width="0.5"
			/>
		{/if}
	</svg>
{/snippet}

<Sheet.Root bind:open>
	<Sheet.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				{@attach tooltip(m.config_title())}
				size="icon"
				variant="ghost"
				aria-label={m.config_aria_open_settings()}
				class="size-7"
			>
				<Settings class="size-[1.2rem]" aria-hidden="true" />
			</Button>
		{/snippet}
	</Sheet.Trigger>
	<Sheet.Content class="flex flex-col" side="right">
		<Sheet.Header class="pb-0 text-start">
			<Sheet.Title>{m.config_title()}</Sheet.Title>
			<Sheet.Description>
				{m.config_description()}
			</Sheet.Description>
		</Sheet.Header>
		<div class="space-y-6 overflow-y-auto px-4">
			<!-- Theme Mode -->
			<div>
				<div class="text-muted-foreground mb-2 text-sm font-semibold">{m.cmd_group_theme()}</div>
				<div class="grid w-full max-w-md grid-cols-3 gap-4">
					{#each themeOptions as option (option.value)}
						{@const isSelected = theme.mode === option.value}
						<button
							type="button"
							class="group text-start transition duration-200 ease-in outline-none"
							aria-label={m.config_aria_select_theme({ name: option.label.toLowerCase() })}
							onclick={() => theme.setMode(option.value)}
						>
							<div
								class={cn(
									'ring-border relative overflow-hidden rounded-md ring-1',
									isSelected && 'ring-primary shadow-2xl'
								)}
							>
								{#if isSelected}
									<CircleCheck
										class="fill-primary stroke-primary-foreground absolute -top-0.5 -right-0.5 z-10 size-5"
									/>
								{/if}
								{#if option.value === 'light'}
									{@render themePreviewLight()}
								{:else if option.value === 'dark'}
									{@render themePreviewDark()}
								{:else}
									{@render themePreviewSystem()}
								{/if}
							</div>
							<div class="mt-1 text-xs">{option.label}</div>
						</button>
					{/each}
				</div>
			</div>

			<!-- Sidebar Variant -->
			<div class="max-md:hidden">
				<div class="text-muted-foreground mb-2 text-sm font-semibold">
					{m.config_section_sidebar()}
				</div>
				<div class="grid w-full max-w-md grid-cols-3 gap-4">
					{#each variantOptions as option (option.value)}
						{@const isSelected = layout.variant === option.value}
						<button
							type="button"
							class="group text-start transition duration-200 ease-in outline-none"
							aria-label={m.config_aria_select_sidebar({ name: option.label.toLowerCase() })}
							onclick={() => layout.setVariant(option.value)}
						>
							<div
								class={cn(
									'ring-border relative overflow-hidden rounded-md ring-1',
									isSelected && 'ring-primary shadow-2xl'
								)}
							>
								{#if isSelected}
									<CircleCheck
										class="fill-primary stroke-primary-foreground absolute -top-0.5 -right-0.5 z-10 size-5"
									/>
								{/if}
								{@render sidebarPreview(option.value)}
							</div>
							<div class="mt-1 text-xs">{option.label}</div>
						</button>
					{/each}
				</div>
			</div>

			<!-- Layout Mode -->
			<div class="max-md:hidden">
				<div class="text-muted-foreground mb-2 text-sm font-semibold">
					{m.config_section_layout()}
				</div>
				<div class="grid w-full max-w-md grid-cols-3 gap-4">
					{#each layoutOptions as option (option.value)}
						{@const isSelected = layoutRadioState === option.value}
						<button
							type="button"
							class="group text-start transition duration-200 ease-in outline-none"
							aria-label={m.config_aria_select_layout({ name: option.label.toLowerCase() })}
							onclick={() => handleLayoutChange(option.value)}
						>
							<div
								class={cn(
									'ring-border relative overflow-hidden rounded-md ring-1',
									isSelected && 'ring-primary shadow-2xl'
								)}
							>
								{#if isSelected}
									<CircleCheck
										class="fill-primary stroke-primary-foreground absolute -top-0.5 -right-0.5 z-10 size-5"
									/>
								{/if}
								{@render layoutPreview(option.value)}
							</div>
							<div class="mt-1 text-xs">{option.label}</div>
						</button>
					{/each}
				</div>
			</div>

			<!-- Color Preset -->
			<div>
				<div class="text-muted-foreground mb-2 text-sm font-semibold">
					{m.config_section_color_preset()}
				</div>
				<div class="grid grid-cols-3 gap-2 sm:grid-cols-4">
					{#each presets as preset (preset.name)}
						<PresetSwatch
							{preset}
							selected={theme.preset === preset.name}
							onclick={() => theme.setPreset(preset.name)}
						/>
					{/each}
				</div>
			</div>
		</div>
		<Sheet.Footer class="gap-2">
			<Button variant="destructive" onclick={handleReset} aria-label={m.config_aria_reset()}>
				<RotateCcw class="size-4" />
				{m.config_reset()}
			</Button>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
