<script lang="ts">
	import Address from './Address.svelte';

	export let addresses: string[] = [];
	export let short = false;
	export let autoShorten = false;
</script>

{#if addresses.length > 0}
	<div class="addresses-list" style:--background="var(--theme-surface-1)">
		{#each addresses as value}
			<Address {value} {autoShorten} {short} />
		{/each}
	</div>
{/if}

<style lang="scss">
	.addresses-list {
		display: flex;
		flex-direction: column;
		align-items: flex-start;

		:global(.address:not(:first-child)) {
			margin-top: 0.5rem;
		}

		@include mixins.desktop {
			align-items: flex-end;
		}
	}
</style>
