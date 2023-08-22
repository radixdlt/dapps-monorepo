<script lang="ts">
  import Accordion from './Accordion.svelte'
  import Address from '../address/Address.svelte'
  import Tags from '../tags/Tags.svelte'
  import NftImage from '../nft-image/NftImage.svelte'
  export let name = ''
  export let imageUrl = ''
  export let tags: string[] = []
  export let address: string
  export let count: number
  export let totalCount: number
</script>

<Accordion>
  <div class="wrapper" slot="header">
    <NftImage url={imageUrl} />

    <div class="content">
      <div class="header {tags.length > 0 ? 'has-tags' : ''}">
        <span class="header-text">{name}</span>
        <div class={name ? 'address-spacing' : ''}>
          <Address value={address} short --background="var(--color-grey-4)" />
        </div>
      </div>

      <Tags {tags} showNetworkTag={false} />
    </div>
  </div>

  <svelte:fragment slot="subheader">{count} of {totalCount}</svelte:fragment>
  <svelte:fragment slot="content">
    <slot />
  </svelte:fragment>
</Accordion>

<style lang="scss">
  @use '../../../mixins.scss';
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
