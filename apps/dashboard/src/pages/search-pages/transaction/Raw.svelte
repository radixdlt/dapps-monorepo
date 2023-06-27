<script lang="ts">
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import CodeBox from '@components/code-box/CodeBox.svelte'

  export let receipt: Promise<any>
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
