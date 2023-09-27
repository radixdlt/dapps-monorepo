<script>
  import { SkeletonLoader } from '@radixdlt/svelte-skeleton-loader'
  import InfoBox from './InfoBox.svelte'
  import Row from './Row.svelte'
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
