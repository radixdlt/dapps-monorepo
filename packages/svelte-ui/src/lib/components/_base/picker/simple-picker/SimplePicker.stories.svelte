<script context="module">
	export const meta = {};
</script>

<script>
	import { Story } from '@storybook/addon-svelte-csf';
	import SimplePicker from './SimplePicker.svelte';

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
	<SimplePicker
		{options}
		selected={{
			label: 'Select an option',
			value: null
		}}
	/>
</Story>
