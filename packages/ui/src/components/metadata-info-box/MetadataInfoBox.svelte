<script lang="ts" context="module">
  type ValueRendererConfig = {
    component: any
    componentProperties: (
      value: EntityMetadataItemValue
    ) => Record<string, any>
  }

  export type MetadataInfoBoxConfig = {
    label?: string
    transformValue?: (value: EntityMetadataItemValue) => string
  } & Partial<ValueRendererConfig>

  type VariantId = string

  type ExtendedEntityMetadataItemValue = {
    raw_json: {
      variant_id: string
    }
  } & EntityMetadataItemValue

  export type ExtendedEntityMetadataItem = ReplaceProperty<
    EntityMetadataItem,
    'value',
    ExtendedEntityMetadataItemValue
  >
</script>

<script lang="ts">
  import { indexBy, prop } from 'ramda'
  import Row from '@components/info-box/Row.svelte'
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import type {
    EntityMetadataItem,
    EntityMetadataItemValue,
    ReplaceProperty
  } from '@radixdlt/babylon-gateway-api-sdk'
  import AddressesList from '@components/_base/address/AddressesList.svelte'
  import Link from '@components/_base/link/Link.svelte'
  import LinksList from '@components/_base/link/LinksList.svelte'

  export let expectedEntries: Record<string, MetadataInfoBoxConfig> = {}
  export let metadata:
    | ExtendedEntityMetadataItem[]
    | Promise<ExtendedEntityMetadataItem[]>

  const defaults: Record<VariantId, ValueRendererConfig> = {
    '8': {
      component: AddressesList,
      componentProperties: (metadataItem: EntityMetadataItemValue) => ({
        addresses: [metadataItem.as_string]
      })
    },
    '13': {
      component: Link,
      componentProperties: (metadataItem: EntityMetadataItemValue) => ({
        url: metadataItem.as_string,
        external: true
      })
    },
    '14': {
      component: Link,
      componentProperties: (metadataItem: EntityMetadataItemValue) => ({
        url: metadataItem.as_string,
        external: true
      })
    },
    '136': {
      component: AddressesList,
      componentProperties: (metadataItem: EntityMetadataItemValue) => ({
        addresses: metadataItem.as_string_collection
      })
    },
    '141': {
      component: LinksList,
      componentProperties: (metadataItem: EntityMetadataItemValue) => ({
        links: metadataItem.as_string_collection?.map((url) => ({ url })),
        external: true
      })
    },
    '142': {
      component: LinksList,
      componentProperties: (metadataItem: EntityMetadataItemValue) => ({
        links: metadataItem.as_string_collection?.map((url) => ({ url })),
        external: true
      })
    }
  }

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
        <Row text={config?.label || key}>
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
        <Row text={key}>
          <div slot="right" class="text-right">
            {@const variantId = value.raw_json.variant_id}
            {#if defaults[variantId]}
              <svelte:component
                this={defaults[variantId].component}
                {...defaults[variantId].componentProperties(
                  resolvedEntries[key].value
                )}
              />
            {:else}
              {value.as_string || value.as_string_collection?.join(', ') || ''}
            {/if}
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
