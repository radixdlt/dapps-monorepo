<script lang="ts">
  import Address from '@components/_base/address/Address.svelte'
  import NftImage from '@components/_base/nft-image/NftImage.svelte'
  import TokenIcon from '@components/_base/token-icon/TokenIcon.svelte'
  import { formatTokenValue } from '@utils'
  import type BigNumber from 'bignumber.js'

  export let poolUnit: {
    poolUnit: {
      name?: string
      icon?: string
      address: string
      accountAmount: string
      poolAddress: string
    }
    poolTokens: {
      name?: string
      icon?: string
      address: string
      redeemableAmount: BigNumber
    }[]
  }
</script>

<div class="pool-unit-card">
  <div class="pool-unit-resource row card">
    <a class="icon-and-name" href={`/pool/${poolUnit.poolUnit.poolAddress}`}>
      <NftImage url={poolUnit.poolUnit.icon} />
      <div class="name-and-address">
        <div class="bold-text">
          {poolUnit.poolUnit.name || ''}
        </div>
        <Address
          value={poolUnit.poolUnit.address}
          short
          --background="var(--color-grey-5)"
        />
      </div>
      <div class="pool-resource-amount">
        {formatTokenValue(poolUnit.poolUnit.accountAmount).displayValue}
      </div>
    </a>
  </div>

  {#each poolUnit.poolTokens as token}
    <div class="pool-token row card">
      <a class="icon-and-name" href={`/resource/${token.address}`}>
        <TokenIcon iconUrl={token.icon} />
        {token.name}
      </a>
      <div class="bold-text">
        {formatTokenValue(token.redeemableAmount).displayValue}
      </div>
    </div>
  {/each}
</div>

<style lang="scss">
  .pool-resource-amount {
    margin-left: auto;
    font-weight: var(--font-weight-bold-2);
    font-size: var(--text-lg);
  }
  .pool-unit-card {
    display: flex;
    flex-direction: column;
    border: var(--border);
    gap: 1px;
    min-width: 15rem;

    .pool-unit-resource {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    .name-and-address {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .pool-token {
      display: flex;
      justify-content: space-between;

      &:not(:last-child) {
        border-radius: 0;
      }

      &:last-child {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
      }
    }
  }

  .icon-and-name {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
    color: var(--theme-text-primary);
    font-weight: var(--font-weight-light);
  }

  .bold-text {
    font-weight: var(--font-weight-bold-2);
    font-size: var(--text-lg);
  }

  .row {
    align-items: center;
    padding: var(--spacing-xl);
  }
</style>
