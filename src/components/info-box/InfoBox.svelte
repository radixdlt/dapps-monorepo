<script lang="ts" context="module">
  import type { SvelteComponent } from 'svelte'

  export const EMPTY_VALUE = `<no value>`

  export type Entries<T> = Readonly<
    Array<Readonly<{ key?: any; value?: any }> & T>
  >

  export const infoboxEntry = <
    C extends typeof SvelteComponent,
    D extends InstanceType<C>['$$prop_def']['data']
  >(
    key: typeof SvelteComponent,
    value: C,
    data?: D
  ) => ({
    key,
    value,
    data
  })
</script>

<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import Text from '@components/_base/text/Text.svelte'
  import type { Size } from '@styles'
  import type { CSS } from '@stitches/core'
  import type { Index } from '@stitches/core/types/util'

  type T = $$Generic

  export let entries: Entries<T> = []
  export let transparent: boolean = false
  export let loading: boolean = false
  export let keyColumnWidth: Size | Index = 'auto'
  export let cx: CSS = {}

  const loaderWidth = 100
</script>

<Box
  gap="medium"
  cx={{
    display: 'grid',
    gridTemplateColumns: `${keyColumnWidth} 5fr`,
    ...cx
  }}
  bgColor={transparent ? undefined : 'surface'}
>
  {#each entries as entry}
    <Box justify="end" wrapper>
      <slot name="key" {entry}>
        <Text nowrap bold>
          {entry.key}
        </Text>
      </slot>
    </Box>

    {#if loading}
      <SkeletonLoader width={loaderWidth} />
    {:else}
      <slot name="value" {entry}>
        <Text>
          {entry.value === undefined ? EMPTY_VALUE : entry.value}
        </Text>
      </slot>
    {/if}
  {/each}
</Box>
