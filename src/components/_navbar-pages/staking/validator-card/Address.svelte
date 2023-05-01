<script lang="ts">
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import { shortenAddress } from '@utils'

  export let address: string
</script>

<div class="address">
  <a class="text">
    {shortenAddress(address)}
  </a>
  <IconNew size="medium" type="copy" />
</div>

<style>
  .address {
    display: grid;
    grid: 1fr / 5fr 1fr;
    align-items: center;
    gap: var(--spacing-xs);
  }
</style>
