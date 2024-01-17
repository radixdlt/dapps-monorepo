<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import CheckedIcon from '@icons/checked-checkbox.svg';

	export let checked = false;
	export let disabled = false;

	const dispatch = createEventDispatcher<{
		checked: undefined;
		unchecked: undefined;
	}>();

	const handleOnClick = () => {
		dispatch(checked ? 'checked' : 'unchecked');
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<button {disabled} on:click|stopPropagation={handleOnClick} class="wrapper">
	<label class="label">
		<input
			{disabled}
			class="checkbox"
			type="checkbox"
			class:checked
			class:disabled
			bind:checked
			style={checked ? `background: center / contain no-repeat url(${CheckedIcon});` : ''}
		/>
		<slot />
	</label>
</button>

<style lang="scss">
	$border-width: 2px;
	$box-size: 14px;

	.wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		width: fit-content;
		height: fit-content;
	}
	.label {
		display: flex;
		align-items: center;
		font-weight: var(--font-weight-bold-2);
		font-size: var(--text-sm);
		color: var(--label-color);
	}
	.checkbox {
		cursor: pointer;
		width: $box-size;
		height: $box-size;
		appearance: none;
		border: $border-width solid var(--color-grey-2);
		border-radius: var(--border-radius-sm);
		margin: 0 var(--spacing-sm) 0 0;
		align-self: center;
		pointer-events: all;
	}

	.checked {
		border: none;
	}

	.disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}
</style>
