<script lang="ts" module>
	import { z } from 'zod';

	const appearanceFormSchema = z.object({
		theme: z.enum(['light', 'dark', 'system']),
		font: z.enum(['inter', 'manrope', 'system'])
	});
</script>

<script lang="ts">
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { m } from '$lib/paraglide/messages.js';
	import { getTheme } from '$lib/contexts/theme.svelte';
	import { presets } from '$lib/themes/preset-data';
	import PresetSwatch from '$lib/components/shared/preset-swatch.svelte';
	import ErrorFallback from '$lib/components/shared/error-fallback.svelte';

	const theme = getTheme();

	const fonts = [
		{ label: 'Inter', value: 'inter' },
		{ label: 'Manrope', value: 'manrope' },
		{ label: 'System', value: 'system' }
	] as const;

	const form = superForm(
		defaults(
			{
				theme: (theme.mode ?? 'system') as 'light' | 'dark' | 'system',
				font: (theme.font ?? 'inter') as 'inter' | 'manrope' | 'system'
			},
			zod4Client(appearanceFormSchema)
		),
		{
			SPA: true,
			validators: zod4Client(appearanceFormSchema),
			resetForm: false,
			invalidateAll: false,
			onUpdate({ form: f }) {
				if (f.valid) {
					theme.setMode(f.data.theme);
					theme.setFont(f.data.font);
					toast.success(m.settings_appearance_toast());
				}
			}
		}
	);

	const { form: formData, enhance, submitting } = form;

	const selectedFontLabel = $derived(
		fonts.find((f) => f.value === $formData.font)?.label ?? m.settings_appearance_font_select()
	);
</script>

<form method="POST" use:enhance class="space-y-8" novalidate>
	<!-- Color Preset (instant apply, not part of form submit) -->
	<div class="space-y-2">
		<div>
			<p class="text-sm leading-none font-medium">{m.config_section_color_preset()}</p>
			<p class="text-muted-foreground text-[0.8rem]">{m.settings_appearance_color_desc()}</p>
		</div>
		<svelte:boundary onerror={(e) => console.error('[PresetSwatches]', e)}>
			<div class="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
				{#each presets as preset (preset.name)}
					<PresetSwatch
						{preset}
						selected={theme.preset === preset.name}
						onclick={() => theme.setPreset(preset.name)}
					/>
				{/each}
			</div>
			{#snippet failed(error, reset)}
				<ErrorFallback {error} {reset} />
			{/snippet}
		</svelte:boundary>
	</div>

	<Form.Field {form} name="font">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>{m.settings_appearance_font()}</Form.Label>
				<Select.Root
					type="single"
					value={$formData.font}
					onValueChange={(v) => {
						if (v) $formData.font = v as 'inter' | 'manrope' | 'system';
					}}
				>
					<Select.Trigger {...props} class="w-[200px]">
						<span class="capitalize">{selectedFontLabel}</span>
					</Select.Trigger>
					<Select.Content>
						{#each fonts as font (font.value)}
							<Select.Item value={font.value}>{font.label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.Description>{m.settings_appearance_font_desc()}</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	{#snippet themeCard(
		value: 'light' | 'dark' | 'system',
		label: string,
		cardClass: string,
		innerClass: string,
		barClass: string,
		dotClass: string
	)}
		<label>
			<RadioGroup.Item {value} class="sr-only" />
			<div
				class="border-muted items-center rounded-md border-2 p-1 {cardClass} {$formData.theme ===
				value
					? 'border-primary'
					: 'hover:border-accent'}"
			>
				<div class="space-y-2 rounded-sm {innerClass} p-2">
					<div class="space-y-2 rounded-md {barClass} p-2 shadow-xs">
						<div class="h-2 w-[67px] rounded-lg {dotClass}"></div>
						<div class="h-2 w-[83px] rounded-lg {dotClass}"></div>
					</div>
					<div class="flex items-center space-x-2 rounded-md {barClass} p-2 shadow-xs">
						<div class="h-4 w-4 rounded-full {dotClass}"></div>
						<div class="h-2 w-[100px] rounded-lg {dotClass}"></div>
					</div>
					<div class="flex items-center space-x-2 rounded-md {barClass} p-2 shadow-xs">
						<div class="h-4 w-4 rounded-full {dotClass}"></div>
						<div class="h-2 w-[100px] rounded-lg {dotClass}"></div>
					</div>
				</div>
			</div>
			<span class="block w-full p-2 text-center font-normal">{label}</span>
		</label>
	{/snippet}

	<Form.Fieldset {form} name="theme" class="space-y-1">
		<Form.Legend>{m.cmd_group_theme()}</Form.Legend>
		<Form.Description>{m.settings_appearance_theme_desc()}</Form.Description>
		<Form.FieldErrors />
		<RadioGroup.Root
			value={$formData.theme}
			onValueChange={(v) => {
				if (v) $formData.theme = v as 'light' | 'dark' | 'system';
			}}
			class="grid max-w-md grid-cols-3 gap-8 pt-2"
		>
			{@render themeCard(
				'light',
				m.common_theme_light(),
				'',
				'bg-[#f4f4f5]',
				'bg-white',
				'bg-[#e4e4e7]'
			)}
			{@render themeCard(
				'dark',
				m.common_theme_dark(),
				'',
				'bg-[#09090b]',
				'bg-[#18181b]',
				'bg-[#3f3f46]'
			)}
			<label>
				<RadioGroup.Item value="system" class="sr-only" />
				<div
					class="border-muted items-center rounded-md border-2 p-1 {$formData.theme === 'system'
						? 'border-primary'
						: 'hover:border-accent'}"
				>
					<div class="relative overflow-hidden rounded-sm">
						<!-- Light half (left) -->
						<div style="clip-path: inset(0 50% 0 0)">
							<div class="space-y-2 rounded-sm bg-[#f4f4f5] p-2">
								<div class="space-y-2 rounded-md bg-white p-2 shadow-xs">
									<div class="h-2 w-[67px] rounded-lg bg-[#e4e4e7]"></div>
									<div class="h-2 w-[83px] rounded-lg bg-[#e4e4e7]"></div>
								</div>
								<div class="flex items-center space-x-2 rounded-md bg-white p-2 shadow-xs">
									<div class="h-4 w-4 rounded-full bg-[#e4e4e7]"></div>
									<div class="h-2 w-[100px] rounded-lg bg-[#e4e4e7]"></div>
								</div>
								<div class="flex items-center space-x-2 rounded-md bg-white p-2 shadow-xs">
									<div class="h-4 w-4 rounded-full bg-[#e4e4e7]"></div>
									<div class="h-2 w-[100px] rounded-lg bg-[#e4e4e7]"></div>
								</div>
							</div>
						</div>
						<!-- Dark half (right) -->
						<div class="absolute inset-0" style="clip-path: inset(0 0 0 50%)">
							<div class="space-y-2 rounded-sm bg-[#09090b] p-2">
								<div class="space-y-2 rounded-md bg-[#18181b] p-2 shadow-xs">
									<div class="h-2 w-[67px] rounded-lg bg-[#3f3f46]"></div>
									<div class="h-2 w-[83px] rounded-lg bg-[#3f3f46]"></div>
								</div>
								<div class="flex items-center space-x-2 rounded-md bg-[#18181b] p-2 shadow-xs">
									<div class="h-4 w-4 rounded-full bg-[#3f3f46]"></div>
									<div class="h-2 w-[100px] rounded-lg bg-[#3f3f46]"></div>
								</div>
								<div class="flex items-center space-x-2 rounded-md bg-[#18181b] p-2 shadow-xs">
									<div class="h-4 w-4 rounded-full bg-[#3f3f46]"></div>
									<div class="h-2 w-[100px] rounded-lg bg-[#3f3f46]"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<span class="block w-full p-2 text-center font-normal"
					>{m.settings_appearance_system()}</span
				>
			</label>
		</RadioGroup.Root>
	</Form.Fieldset>

	<Button type="submit" disabled={$submitting}>{m.settings_appearance_update()}</Button>
</form>
