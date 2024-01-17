<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import Backdrop from '../backdrop/Backdrop.svelte';

	export let open = true;
	export let useBackdrop = false;

	const dispatch = createEventDispatcher<{
		close: null;
	}>();

	let panel: HTMLDivElement;

	function handleKeydown(event: KeyboardEvent) {
		if (open && event.key === 'Escape') dispatch('close');
	}
</script>

<svelte:window on:keydown={(e) => handleKeydown(e)} />

<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if open}
	{#if useBackdrop}
		<Backdrop
			on:click={() => {
				dispatch('close');
			}}
		/>
	{/if}

	<div
		role="dialog"
		class="side-panel"
		bind:this={panel}
		transition:fly|global={{ duration: 300, opacity: 1, x: panel.clientWidth }}
	>
		<slot />
	</div>
{/if}

<style lang="scss">
	.side-panel {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		width: var(--width, 50rem);
		background: var(--color-grey-5);
		z-index: 3;
		overflow-y: scroll;
		padding: var(--spacing-2xl) var(--spacing-3xl);
	}
</style>
