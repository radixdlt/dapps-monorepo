<script lang="ts">
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import { shortenAddress } from '@utils'
  import CopyIcon from '@icons/copy.svg'

  export let address: string
</script>

<div class="address">
  <a>
    {shortenAddress(address)}
  </a>
  <IconNew size="medium" icon={CopyIcon} />
</div>

<style>
  .address {
    display: grid;
    grid: 1fr / 5fr 1fr;
    align-items: center;
    gap: var(--spacing-xs);
  }
</style>
