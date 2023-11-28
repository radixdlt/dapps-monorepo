<script lang="ts">
  import Accordion from './Accordion.svelte'
  import Address from '../address/Address.svelte'
  import Tags from '../tags/Tags.svelte'
  import NftImage from '../nft-image/NftImage.svelte'
  import { SkeletonLoader } from '@radixdlt/svelte-skeleton-loader'

  type Data = {
    name?: string
    address: string
    imageUrl?: string
    count: number
    totalCount: number
    tags?: string[]
  }

  export let data: Promise<Data> | Data

  const _data = Promise.resolve(data)

  let hasTags: boolean
  let hasName: boolean

  _data.then(({ tags, name }) => {
    hasTags = !!(tags && tags.length > 0)
    hasName = !!name
  })
</script>

<div class="nft-accordion">
  <Accordion>
    <div class="wrapper" slot="header">
      {#await _data}
        <NftImage />
      {:then { imageUrl }}
        <NftImage url={imageUrl} />
      {/await}

      <div class="content">
        <div class="header" class:has-tags={hasTags}>
          <span class="header-text">
            {#await _data}
              <SkeletonLoader width={100} height={20} />
            {:then { name }}
              {name ?? ''}
            {/await}
          </span>
          <div class:address-spacing={hasName}>
            {#await _data then { address }}
              <Address
                value={address}
                short
                --background="var(--color-grey-4)"
              />
            {/await}
          </div>
        </div>

        {#await _data then { tags }}
          <Tags {tags} showNetworkTag={false} />
        {/await}
      </div>
    </div>

    <svelte:fragment slot="subheader">
      {#await _data then { count, totalCount }}
        {count} of {totalCount}
      {/await}
    </svelte:fragment>

    <svelte:fragment slot="content">
      <slot />
    </svelte:fragment>
  </Accordion>
</div>

<style lang="scss">
  .nft-accordion {
    :global(.header-wrapper) {
      height: 8rem;

      @include mixins.desktop {
        height: 7rem;
      }
    }

    :global(.accordion) {
      border-top: 1px solid var(--theme-border-separator);

      &:last-child {
        border-bottom: 1px solid var(--theme-border-separator);
      }
    }
    :global(.content) {
      padding-bottom: 1rem;
    }
  }
  .address-spacing {
    margin: 0.5rem 0;

    @include mixins.desktop {
      margin-left: 0.5rem;
      margin-bottom: 0;
      margin-top: 0;
    }
  }

  .content {
    margin-left: 1.5rem;
    display: flex;
    flex-direction: column;
  }

  .header {
    display: flex;
    flex-direction: column;

    @include mixins.desktop {
      flex-direction: row;
      align-items: center;

      &.has-tags {
        margin-bottom: var(--spacing-md);
      }
    }
  }

  .wrapper {
    display: flex;
    align-items: center;
  }
</style>
