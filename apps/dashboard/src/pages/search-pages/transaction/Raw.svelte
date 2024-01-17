<script lang="ts">
  import SkeletonLoader from '@svelte-ui/components/_base/skeleton-loader/SkeletonLoader.svelte'
  import CodeBox from '@svelte-ui/components/code-box/CodeBox.svelte'
  import type { TransactionReceipt } from '@common/utils/gateway-sdk'

  export let receipt: Promise<TransactionReceipt | undefined>
</script>

<div class="wrapper surface-2" style:--code-box-min-height="500px">
  {#await receipt}
    <SkeletonLoader count={10} />
  {:then receipt}
    <CodeBox text={JSON.stringify(receipt, null, 2)} />
  {/await}
</div>

<style lang="scss">
  .wrapper {
    padding: 1rem;
  }
</style>
