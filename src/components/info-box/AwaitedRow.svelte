<script lang="ts">
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import Text from '@components/_base/text/Text.svelte'
  import SimpleRow from './SimpleRow.svelte'

  type T = $$Generic

  export let key: string
  export let value: Promise<T>
</script>

<SimpleRow {key}>
  {#await value}
    <SkeletonLoader />
  {:then data}
    <slot {data}>
      <Text>{data}</Text>
    </slot>
  {/await}
</SimpleRow>
