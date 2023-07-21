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
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import PadlockIcon from '@icons/validators-menu.svg'
  import type {
    EntityMetadataItem,
    EntityMetadataItemValue
  } from '@radixdlt/babylon-gateway-api-sdk'
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import TypedMetadataRenderer from './TypedMetadataRenderer.svelte'

  export let expectedEntries: Record<string, MetadataInfoBoxConfig> = {}
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
            <TypedMetadataRenderer metadataTypedValue={value.typed} />

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
