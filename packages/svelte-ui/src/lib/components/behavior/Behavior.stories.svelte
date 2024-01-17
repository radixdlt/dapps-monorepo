<script context="module">
	export const meta = {};
</script>

<script>
	import { Story } from '@storybook/addon-svelte-csf';
	import Behavior from './Behavior.svelte';
</script>

<Story name="Primary">
	<div>
		<Behavior type="simple" />
		<Behavior type="supply-increase" />
		<Behavior type="supply-decrease" />
		<Behavior type="supply-increase-decrease" />
		<Behavior type="supply-increase-anyone" />
		<Behavior type="supply-decrease-anyone" />
		<Behavior type="supply-increase-decrease-anyone" />
		<Behavior type="movement-restricted" />
		<Behavior type="movement-restricted-future" />
		<Behavior type="movement-restricted-future-anyone" />
		<Behavior type="info-can-change" />
		<Behavior type="info-can-change-anyone" />
		<Behavior type="removable-by-third-party" />
		<Behavior type="removable-by-anyone" />
		<Behavior type="nft-data-changeable" />
		<Behavior type="nft-data-changeable-anyone" />
	</div>
</Story>

<style>
	div {
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-2xl);
	}
</style>
