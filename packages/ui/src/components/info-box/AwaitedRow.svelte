<script lang="ts">
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import Box from '@components/_base/box/Box.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import Row from './Row.svelte'

  type T = $$Generic

  export let text: string
  export let promise: Promise<T>
</script>

<Row {text}>
  <Box wrapper slot="right">
    {#await promise}
      <SkeletonLoader />
    {:then data}
      <slot {data}>
        <Text>{data}</Text>
      </slot>
    {/await}
  </Box>
</Row>
