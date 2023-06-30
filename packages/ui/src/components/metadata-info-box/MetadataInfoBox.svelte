<script lang="ts" context="module">
  export type MetadataInfoBoxConfig = {
    label?: string
    transformValue?: (value: EntityMetadataItemValue) => string
    component?: any
    componentProperties?: (
      value: EntityMetadataItemValue
    ) => Record<string, any>
  }
</script>

<script lang="ts">
  import { indexBy, prop } from 'ramda'
  import Row from '@components/info-box/Row.svelte'
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import type {
    EntityMetadataItem,
    EntityMetadataItemValue
  } from '@radixdlt/babylon-gateway-api-sdk'

  export let expectedEntries: Record<string, MetadataInfoBoxConfig>
  export let metadata: EntityMetadataItem[] | Promise<EntityMetadataItem[]>

  $: entries = Promise.resolve(metadata).then((resolved) =>
    indexBy(prop('key'), resolved)
  )
</script>

{#await entries}
  <SkeletonLoader />
{:then resolvedEntries}
  <InfoBox>
    {#each Object.entries(expectedEntries) as [key, config]}
      {#if resolvedEntries[key]}
        <Row text={config?.label || key.split('_').join(' ')}>
          <svelte:fragment slot="right">
            {#if config?.component}
              {#if config?.componentProperties}
                <svelte:component
                  this={config.component}
                  {...config.componentProperties(resolvedEntries[key].value)}
                />
              {:else}
                <svelte:component this={config.component} />
              {/if}
            {:else if config?.transformValue}
              {config.transformValue(resolvedEntries[key].value)}
            {:else}
              <div class="text-right">
                {resolvedEntries[key].value.as_string ||
                  resolvedEntries[key].value.as_string_collection?.join(', ') ||
                  ''}
              </div>
            {/if}
          </svelte:fragment>
        </Row>
      {/if}
    {/each}

    {#each Object.entries(resolvedEntries) as [key, { value }]}
      {#if !expectedEntries[key]}
        <Row text={key.split('_').join(' ')}>
          <div slot="right" class="text-right">
            {value.as_string || value.as_string_collection?.join(', ') || ''}
          </div>
        </Row>
      {/if}
    {/each}
  </InfoBox>
{/await}

<style lang="scss">
  .text-right {
    text-align: right;
  }
</style>
