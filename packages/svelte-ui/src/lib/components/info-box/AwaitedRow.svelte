<script lang="ts">
	import SkeletonLoader from '@svelte-ui/components/_base/skeleton-loader/SkeletonLoader.svelte';
	import Text from '@svelte-ui/components/_base/text/Text.svelte';
	import Row from './Row.svelte';

	type T = $$Generic;

	export let text: string;
	export let modifiers = '';
	export let promise: Promise<T>;
</script>

<Row {text} {modifiers}>
	<svelte:fragment slot="right">
		{#await promise}
			<SkeletonLoader />
		{:then data}
			<slot {data}>
				<Text>{data}</Text>
			</slot>
		{/await}
	</svelte:fragment>
</Row>
