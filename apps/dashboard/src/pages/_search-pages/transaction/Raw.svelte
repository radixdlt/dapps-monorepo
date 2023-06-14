<script lang="ts">
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import CodeBox from '@components/code-box/CodeBox.svelte'
  import Box from '@components/_base/box/Box.svelte'

  export let receipt: Promise<any>
</script>

<Box cx={{ width: '100vh' }}>
  {#await receipt}
    <SkeletonLoader count={10} />
  {:then receipt}
    <div style:width="100%" style:height="100vh">
      <CodeBox text={JSON.stringify(receipt, null, 4)} />
    </div>
  {/await}
</Box>
