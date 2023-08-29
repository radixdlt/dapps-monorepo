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
  import { indexBy, prop } from 'ramda'
  import Row from '@components/info-box/Row.svelte'
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import PadlockIcon from '@icons/validators-menu.svg'
  import type {
    EntityMetadataItem,
    EntityMetadataItemValue
  } from '@radixdlt/babylon-gateway-api-sdk'
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import TypedMetadataRenderer from './TypedMetadataRenderer.svelte'

  export let expectedEntries: Record<string, MetadataInfoBoxConfig> = {}
  export let metadata:
    | EntityMetadataItem[]
    | Promise<EntityMetadataItem[] | void>

  $: entries = Promise.resolve(metadata).then((resolved) =>
    indexBy(prop('key'), resolved || [])
  )
</script>

<div>
  {#await entries}
    <SkeletonLoader />
  {:then resolvedEntries}
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
        <Row>
          <div slot="left" class="label">
            {key}
            {#if resolvedEntries[key].is_locked}
              <IconNew icon={PadlockIcon} />
            {/if}
          </div>
          <div slot="right" class="right-slot">
            <TypedMetadataRenderer metadataTypedValue={value.typed} />
          </div>
        </Row>
      {/if}
    {/each}

    <slot name="extra-rows" />
  {/await}
</div>

<style lang="scss">
  @use '../../mixins.scss';

  .label {
    color: var(--color-grey-2);
    font-weight: var(--font-weight-bold-2);
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 1rem;
    margin-right: 2rem;

    @include mixins.desktop {
      margin-bottom: 0;
    }
  }
  .right-slot {
    text-align: right;
    display: flex;
    align-items: center;
    gap: 10px;
    word-break: break-all;
  }
</style>
