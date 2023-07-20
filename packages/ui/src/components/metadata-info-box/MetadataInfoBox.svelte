<script lang="ts" context="module">
  type ValueRendererConfig = {
    component: any
    componentProperties: (value: EntityMetadataItemValue) => Record<string, any>
  }

  export type MetadataInfoBoxConfig = {
    label: string
    renderAs?: (value: EntityMetadataItemValue) => string
  } & ValueRendererConfig
</script>

<script lang="ts">
  import { indexBy, prop, type } from 'ramda'
  import Row from '@components/info-box/Row.svelte'
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import Renderer from '@components/renderer/Renderer.svelte'
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import PadlockIcon from '@icons/validators-menu.svg'
  import type {
    EntityMetadataItem,
    EntityMetadataItemValue,
    MetadataGlobalAddressArrayValue,
    MetadataGlobalAddressValue,
    MetadataNonFungibleGlobalIdArrayValue,
    MetadataNonFungibleGlobalIdValue,
    MetadataPublicKeyArrayValue,
    MetadataPublicKeyHashArrayValue,
    MetadataPublicKeyHashValue,
    MetadataPublicKeyValue
  } from '@radixdlt/babylon-gateway-api-sdk'
  import AddressesList from '@components/_base/address/AddressesList.svelte'
  import Link from '@components/_base/link/Link.svelte'
  import LinksList from '@components/_base/link/LinksList.svelte'
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import StringValueMetadata from './StringValueMetadata.svelte'
  import StringArrayValueMetadata from './StringArrayValueMetadata.svelte'

  export let expectedEntries: Record<string, MetadataInfoBoxConfig> = {}
  export let metadata: EntityMetadataItem[] | Promise<EntityMetadataItem[]>

  const stringValueConfig = {
    component: StringValueMetadata,
    componentProperties: ({ typed }: any) => ({
      value: typed.value
    })
  }

  const stringArrayValueConfig = {
    component: StringArrayValueMetadata,
    componentProperties: ({ typed }: any) => ({
      values: typed.values
    })
  }

  const linkValueConfig = {
    component: Link,
    componentProperties: ({ typed }: any) => ({
      url: typed.value,
      external: true
    })
  }

  const linkArrayValueConfig = {
    component: LinksList,
    componentProperties: ({ typed }: any) => ({
      links: typed.values.map((url: any) => ({ url })),
      external: true
    })
  }

  const defaults = {
    Bool: stringValueConfig,
    BoolArray: stringArrayValueConfig,
    Decimal: stringValueConfig,
    DecimalArray: stringArrayValueConfig,
    GlobalAddress: {
      component: AddressesList,
      componentProperties: ({ typed }: any) => ({
        addresses: [typed.value]
      })
    },
    GlobalAddressArray: {
      component: AddressesList,
      componentProperties: ({ typed }: any) => ({
        addresses: typed.values
      })
    },
    I32: stringValueConfig,
    I32Array: stringArrayValueConfig,
    I64: stringValueConfig,
    I64Array: stringArrayValueConfig,
    Instant: stringValueConfig,
    InstantArray: stringArrayValueConfig,
    NonFungibleGlobalId: {
      component: AddressesList,
      componentProperties: ({ typed }: any) => ({
        addresses: [`${typed.resource_address}:${typed.non_fungible_id}`]
      })
    },
    NonFungibleGlobalIdArray: {
      component: AddressesList,
      componentProperties: ({ typed }: any) => ({
        addresses: typed.values.map(
          (typed: any) => `${typed.resource_address}:${typed.non_fungible_id}`
        )
      })
    },
    NonFungibleLocalId: stringValueConfig,
    NonFungibleLocalIdArray: stringArrayValueConfig,
    Origin: linkValueConfig,
    OriginArray: linkArrayValueConfig,
    PublicKey: {
      component: StringValueMetadata,
      componentProperties: ({ typed }: { typed: MetadataPublicKeyValue }) => ({
        value: `${typed.value.key_type}(${typed.value.key_hex})`
      })
    },
    PublicKeyArray: {
      component: StringArrayValueMetadata,
      componentProperties: ({
        typed
      }: {
        typed: MetadataPublicKeyArrayValue
      }) => ({
        values: typed.values.map(
          (value) => `${value.key_type}(${value.key_hex})`
        )
      })
    },
    PublicKeyHash: {
      component: StringValueMetadata,
      componentProperties: ({
        typed
      }: {
        typed: MetadataPublicKeyHashValue
      }) => ({
        value: `${typed.value.key_hash_type}(${typed.value.hash_hex})`
      })
    },
    PublicKeyHashArray: {
      component: StringArrayValueMetadata,
      componentProperties: ({
        typed
      }: {
        typed: MetadataPublicKeyHashArrayValue
      }) => ({
        values: typed.values.map(
          (value) => `${value.key_hash_type}(${value.hash_hex})`
        )
      })
    },
    String: stringValueConfig,
    StringArray: stringArrayValueConfig,
    U32: stringValueConfig,
    U32Array: stringArrayValueConfig,
    U64: stringValueConfig,
    U64Array: stringArrayValueConfig,
    U8: stringValueConfig,
    U8Array: stringArrayValueConfig,
    Url: linkValueConfig,
    UrlArray: linkArrayValueConfig
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
            {:else if config?.renderAs}
              {config.renderAs(resolvedEntries[key].value)}
            {/if}
          </svelte:fragment>
        </Row>
      {/if}
    {/each}

    {#each Object.entries(resolvedEntries) as [key, { value }]}
      {#if !expectedEntries[key]}
        <Row text={key}>
          <div slot="right" class="text-right">
            {@const type = value.typed?.type}
            {@const predefined = defaults[type || 'String']}
            <Renderer
              component={predefined.component}
              props={predefined.componentProperties(resolvedEntries[key].value)}
            />

            {#if resolvedEntries[key].is_locked}
              <IconNew icon={PadlockIcon} />
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
