<script lang="ts" context="module">
  import type { SvelteComponent } from 'svelte'

  export const EMPTY_VALUE = `<no value>`

  export type Entries<T> = Readonly<
    Array<Readonly<{ key: string; value?: unknown }> & T>
  >

  export const infoboxEntry = <
    C extends typeof SvelteComponent,
    V extends InstanceType<C>['$$prop_def']['value']
  >(
    component: C,
    key: string,
    value: V
  ) => ({
    key,
    value,
    component
  })
</script>

<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import Text from '@components/_base/text/Text.svelte'

  type T = $$Generic

  export let entries: Entries<T> = []
  export let transparent: boolean = false
  export let loading: boolean = false

  const loaderWidth = 100
</script>

<Box bgColor={transparent ? undefined : 'surface'}>
  <Box
    gap="medium"
    cx={{
      display: 'grid',
      gridTemplateColumns: 'auto 5fr'
    }}
    bgColor={transparent ? undefined : 'surface'}
  >
    {#each entries as entry}
      <Box justify="end" wrapper>
        <slot name="key" {entry}>
          <Text bold>
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
</Box>
