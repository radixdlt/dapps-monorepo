<script lang="ts">
	import type { sendTransaction } from '@common/api/wallet';
	import ButtonNew from '@svelte-ui/components/_base/button/ButtonNew.svelte';
	import LoadingSpinner from '@svelte-ui/components/_base/button/loading-spinner/LoadingSpinner.svelte';
	import IconNew from '@svelte-ui/components/_base/icon/IconNew.svelte';
	import { createEventDispatcher, type ComponentProps } from 'svelte';
	import ExternalLink from '@icons/external.svg';
	import { query } from '@common/api/query';

	export let buttonProps: ComponentProps<ButtonNew>;

	const dispatch = createEventDispatcher<{
		click: typeof send;
		response: Awaited<ReturnType<typeof sendTransaction>>;
	}>();

	let loading = false;

	const { send, response, error } = query('sendTransaction');

	$: if ($response) {
		dispatch('response', $response);
		loading = false;
	}

	$: if ($error) {
		loading = false;
	}
</script>

<ButtonNew
	{...buttonProps}
	on:click={() => {
		if (loading) return;
		loading = true;
		dispatch('click', send);
	}}
>
	{#if loading}
		<div style:height="60%" style:aspect-ratio="1/1">
			<LoadingSpinner />
		</div>
	{:else}
		<slot>
			<div class="button-text">
				Send to the Radix Wallet
				<IconNew icon={ExternalLink} size="small" />
			</div>
		</slot>
	{/if}
</ButtonNew>

<style>
	.button-text {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-lg);
		color: var(--color-light);
		font-weight: var(--font-weight-bold-2);
	}
</style>
