<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let value: string;
	export let maxlength: number | undefined = undefined;
	export let format: (value: string) => string = (value) => value;
	export let readonly = false;

	const dispatch = createEventDispatcher<{
		input: { value: string };
	}>();

	$: {
		value = format(value);
		dispatch('input', { value });
	}
</script>

<input
	{value}
	type="text"
	{readonly}
	{maxlength}
	on:input={(e) => {
		value = e.currentTarget.value;
	}}
/>
<slot name="postfix" />

<style>
	input {
		width: var(--input-width, 100%);
		font-size: var(--font-size);
		font-weight: var(--font-weight);
		text-align: var(--text-align);
		color: var(--text-color);
	}
</style>
