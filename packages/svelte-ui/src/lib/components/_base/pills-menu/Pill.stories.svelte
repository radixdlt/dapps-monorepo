<script context="module">
	export const meta = {};
</script>

<script lang="ts">
	import { Story, Template } from '@storybook/addon-svelte-csf';
	import Pill from './Pill.svelte';
</script>

<Template>
	<Pill active>Tokens</Pill>
	<Pill>Nfts</Pill>
</Template>

<Story name="Primary" />
