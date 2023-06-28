<script lang="ts">
  import Accordion from './Accordion.svelte'
  import TokenIcon from '../token-icon/TokenIcon.svelte'

  export let isXrd = false
  export let header: string
  export let iconUrl = ''
</script>

<Accordion>
  <div class="token-header" slot="header">
    <TokenIcon {isXrd} {iconUrl} />
    <div class="header-text">{header}</div>
  </div>
  <svelte:fragment slot="content">
    <slot />
  </svelte:fragment>
</Accordion>

<style lang="scss">
  .token-header {
    display: flex;
    align-items: center;
  }

  .header-text {
    margin-left: 1rem;
  }
</style>
