<script lang="ts" context="module">
	export const meta = {
		argTypes: {
			size: {
				options: ['big', 'small'],
				control: { type: 'select' }
			}
		}
	};
</script>

<script lang="ts">
	import { Story, Template } from '@storybook/addon-svelte-csf';
	import Button from './ButtonNew.svelte';
</script>

<Template let:args>
	<Button size={args.size} on:click>
		{args.text}
	</Button>
</Template>

<Story name="Big" args={{ text: 'Button', size: 'big' }} />

<Story name="Small" args={{ text: 'Button', size: 'small' }} />
