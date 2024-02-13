<script lang="ts">
  import BigNumber from 'bignumber.js'

  import Address from '@components/_base/address/Address.svelte'
  import { formatTokenValue } from '@utils'
  import TokenIcon from '@components/_base/token-icon/TokenIcon.svelte'

  export let header: string
  export let address: string
  export let value: BigNumber
</script>

<div class="valuebox">
  <div class="header">
    {header}
    <Address
      value={address}
      autoShorten
      --background="var(--theme-surface-3)"
    />
  </div>
  <div class="content">
    <div class="token"><TokenIcon --size="24px" isXrd />XRD</div>
    <span class="value">{formatTokenValue(value).displayValue}</span>
  </div>
</div>

<style lang="scss">
  .valuebox {
    border-radius: var(--border-radius-lg);
    border: 1px solid var(--color-grey-4);

    &:not(:first-child) {
      margin-top: var(--spacing-xl);
    }
  }

  .token {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    font-weight: var(--font-weight-bold-1);
  }

  .value {
    font-weight: var(--font-weight-bold-2);
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: var(--font-weight-bold-2);
    background: var(--color-grey-5);
    padding: var(--spacing-lg) var(--spacing-xl);
    border-bottom: 1px solid var(--color-grey-4);
  }

  .content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-lg) var(--spacing-xl);
  }
</style>
