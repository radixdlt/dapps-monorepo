<script>
	import SkeletonLoader from '@svelte-ui/components/_base/skeleton-loader/SkeletonLoader.svelte';
	import InfoBox from './InfoBox.svelte';
	import Row from './Row.svelte';
</script>

<InfoBox>
	<Row>
		<SkeletonLoader slot="left" />
		<SkeletonLoader slot="right" />
	</Row>
	<Row>
		<SkeletonLoader slot="left" />
		<SkeletonLoader slot="right" />
	</Row>
	<Row>
		<SkeletonLoader slot="left" />
		<SkeletonLoader slot="right" />
	</Row>
</InfoBox>
