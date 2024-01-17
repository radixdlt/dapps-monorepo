<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import CloseButton from './CloseButton.svelte';

	export let text: string;
	const dispatch = createEventDispatcher();
</script>

<div class="wrapper">
	<CloseButton on:click={() => dispatch('closeClick')} />
	<h2>{text}</h2>
	<div>
		<slot />
	</div>
</div>

<style lang="scss">
	.wrapper {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 2rem;
		border-bottom: 1px solid var(--theme-surface-3);
		padding-bottom: 1.25rem;
		h2 {
			margin: 0;
		}
	}
</style>
