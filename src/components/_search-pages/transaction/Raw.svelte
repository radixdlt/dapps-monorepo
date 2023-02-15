<script lang="ts">
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import Box from '@components/_base/box/Box.svelte'
  import Text from '@components/_base/text/Text.svelte'

  export let receipt: Promise<any>
</script>

<Box cx={{ width: '100vh' }}>
  {#await receipt}
    <SkeletonLoader count={10} />
  {:then receipt}
    <pre>
    <Text>{JSON.stringify(receipt, null, 4)}</Text>
  </pre>
  {/await}
</Box>
