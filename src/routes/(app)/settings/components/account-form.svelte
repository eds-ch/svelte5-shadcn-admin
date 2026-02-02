<script lang="ts">
	import { z } from 'zod';
	import { onMount, tick } from 'svelte';
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		parseDate,
		today
	} from '@internationalized/date';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { cn } from '$lib/utils';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime.js';

	let { formState = $bindable<Record<string, unknown> | null>(null) } = $props();
	let _mounted = false;

	const languages = [
		{ label: m.settings_lang_english(), value: 'en' },
		{ label: m.settings_lang_french(), value: 'fr' },
		{ label: m.settings_lang_german(), value: 'de' },
		{ label: m.settings_lang_spanish(), value: 'es' },
		{ label: m.settings_lang_portuguese(), value: 'pt' },
		{ label: m.settings_lang_russian(), value: 'ru' },
		{ label: m.settings_lang_japanese(), value: 'ja' },
		{ label: m.settings_lang_korean(), value: 'ko' },
		{ label: m.settings_lang_chinese(), value: 'zh' }
	];

	const accountFormSchema = z.object({
		name: z.string().min(2, m.validation_name_min()).max(30, m.validation_name_max()),
		dob: z.string().refine((v) => v, { message: m.validation_dob_required() }),
		language: z.string().refine((v) => v, { message: m.validation_language_required() })
	});

	const form = superForm(
		defaults(
			{
				name: '',
				dob: '',
				language: ''
			},
			zod4Client(accountFormSchema)
		),
		{
			SPA: true,
			validators: zod4Client(accountFormSchema),
			onUpdate({ form: f }) {
				if (f.valid) {
					toast.success(m.settings_account_toast());
				}
			}
		}
	);

	const { form: formData, enhance, submitting } = form;

	const df = new DateFormatter(getLocale(), { dateStyle: 'long' });
	let dobValue = $derived($formData.dob ? parseDate($formData.dob) : undefined);
	let placeholder = $state<DateValue>(today(getLocalTimeZone()));

	let langOpen = $state(false);
	let triggerEl = $state<HTMLElement | null>(null);

	onMount(() => {
		if (formState) {
			Object.assign($formData, formState);
		}
		_mounted = true;
	});

	$effect(() => {
		const data = structuredClone($formData);
		if (_mounted) {
			formState = data as Record<string, unknown>;
		}
	});

	function closeAndFocusTrigger() {
		langOpen = false;
		tick().then(() => {
			triggerEl?.focus();
		});
	}
</script>

<form method="POST" use:enhance class="space-y-8" novalidate>
	<Form.Field {form} name="name">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>{m.settings_account_name()}</Form.Label>
				<Input
					{...props}
					bind:value={$formData.name}
					placeholder={m.settings_account_name_placeholder()}
				/>
			{/snippet}
		</Form.Control>
		<Form.Description>
			{m.settings_account_name_desc()}
		</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="dob" class="flex flex-col">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>{m.settings_account_dob()}</Form.Label>
				<Popover.Root>
					<Popover.Trigger
						{...props}
						class={cn(
							buttonVariants({ variant: 'outline' }),
							'w-[280px] justify-start ps-4 text-start font-normal',
							!dobValue && 'text-muted-foreground'
						)}
					>
						{dobValue
							? df.format(dobValue.toDate(getLocalTimeZone()))
							: m.settings_account_dob_pick()}
						<CalendarIcon class="ms-auto size-4 opacity-50" />
					</Popover.Trigger>
					<Popover.Content class="w-auto p-0" side="top">
						<Calendar
							type="single"
							value={dobValue as DateValue}
							bind:placeholder
							locale={getLocale()}
							captionLayout="dropdown"
							minValue={new CalendarDate(1900, 1, 1)}
							maxValue={today(getLocalTimeZone())}
							calendarLabel={m.settings_account_dob()}
							onValueChange={(v) => {
								if (v) {
									$formData.dob = v.toString();
								} else {
									$formData.dob = '';
								}
							}}
						/>
					</Popover.Content>
				</Popover.Root>
				<Form.Description>
					{m.settings_account_dob_desc()}
				</Form.Description>
				<Form.FieldErrors />
				<input hidden value={$formData.dob} name={props.name} />
			{/snippet}
		</Form.Control>
	</Form.Field>

	<Form.Field {form} name="language" class="flex flex-col">
		<Popover.Root bind:open={langOpen}>
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>{m.settings_account_language()}</Form.Label>
					<Popover.Trigger
						bind:ref={triggerEl}
						class={cn(
							buttonVariants({ variant: 'outline' }),
							'w-[200px] justify-between',
							!$formData.language && 'text-muted-foreground'
						)}
						role="combobox"
						{...props}
					>
						{languages.find((l) => l.value === $formData.language)?.label ??
							m.settings_account_language_select()}
						<ChevronsUpDownIcon class="opacity-50" />
					</Popover.Trigger>
					<input hidden value={$formData.language} name={props.name} />
				{/snippet}
			</Form.Control>
			<Popover.Content class="w-[200px] p-0">
				<Command.Root>
					<Command.Input autofocus placeholder={m.settings_account_language_search()} class="h-9" />
					<Command.Empty>{m.settings_account_language_empty()}</Command.Empty>
					<Command.Group value="languages">
						{#each languages as language (language.value)}
							<Command.Item
								value={language.label}
								onSelect={() => {
									$formData.language = language.value;
									closeAndFocusTrigger();
								}}
							>
								{language.label}
								<CheckIcon
									class={cn('ms-auto', language.value !== $formData.language && 'text-transparent')}
								/>
							</Command.Item>
						{/each}
					</Command.Group>
				</Command.Root>
			</Popover.Content>
		</Popover.Root>
		<Form.Description>
			{m.settings_account_language_desc()}
		</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Button type="submit" disabled={$submitting}>{m.settings_account_update()}</Button>
</form>
