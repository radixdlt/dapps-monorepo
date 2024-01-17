<script lang="ts">
	import IconNew from '@svelte-ui/components/_base/icon/IconNew.svelte';
	import ChevronRight from '@icons/chevron-right.svg';
	import { createEventDispatcher } from 'svelte';

	export let disabledNext = false;
	export let disabledPrevious = false;

	const dispatch = createEventDispatcher();
</script>

<div class="pagination">
	<button
		class="paging-button left {disabledPrevious ? 'disabled' : ''}"
		on:click={() => dispatch('previous')}><IconNew icon={ChevronRight} --size="1.5rem" /></button
	>
	<button class="paging-button {disabledNext ? 'disabled' : ''}" on:click={() => dispatch('next')}
		><IconNew icon={ChevronRight} --size="1.5rem" /></button
	>
</div>

<style lang="scss">
	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.left {
		transform: rotate(180deg);
		margin-right: 10px;
	}

	.paging-button {
		display: flex;
		width: 45px;
		height: 45px;
		padding: 8px 14px;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
		border-radius: var(--border-radius-lg);
		background: var(--color-grey-4);
	}
</style>
