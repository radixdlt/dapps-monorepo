<script lang="ts" context="module">
	export const meta = {
		component: IconTextItem,
		argTypes: {
			text: {
				control: 'text'
			}
		}
	};
</script>

<script lang="ts">
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import IconTextItem from './IconTextItem.svelte';
</script>

<Template let:args>
	<IconTextItem bold={args.bold} icon="accounts">{args.text}</IconTextItem>
</Template>

<Story
	name="Primary"
	args={{
		text: 'Accounts'
	}}
/>

<Story
	name="bold"
	args={{
		text: 'Accounts',
		bold: true
	}}
/>
