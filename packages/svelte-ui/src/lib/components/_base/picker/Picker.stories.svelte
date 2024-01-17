<script context="module">
	export const meta = {};
</script>

<script>
	import { Story } from '@storybook/addon-svelte-csf';
	import Picker from './RawPicker.svelte';

	let options = [
		{
			label: 'Option 1',
			value: 1
		},
		{
			label: 'Option 2',
			value: 2
		},
		{
			label: 'Option 3',
			value: 3
		}
	];
</script>

<Story name="Primary">
	<Picker {options}>
		<div slot="selected" let:selected>
			{selected?.label ?? 'Select an option'}
		</div>

		<div slot="option" let:option>
			{option.label}
		</div>
	</Picker>
</Story>
