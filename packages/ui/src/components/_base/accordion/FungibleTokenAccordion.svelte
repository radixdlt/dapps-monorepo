<script lang="ts">
  import Accordion from './Accordion.svelte'
  import TokenIcon from '../token-icon/TokenIcon.svelte'

  export let isXrd = false
  export let header: string
  export let iconUrl = ''
</script>

<div class="fungible-accordion">
  <Accordion>
    <div class="token-header" slot="header">
      <TokenIcon {isXrd} {iconUrl} />
      <div class="header-text">{header}</div>
    </div>
    <svelte:fragment slot="content">
      <slot />
    </svelte:fragment>
  </Accordion>
</div>

<style lang="scss">
  .fungible-accordion {
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
  .token-header {
    display: flex;
    align-items: center;
  }

  .header-text {
    margin-left: 1rem;
  }
</style>
