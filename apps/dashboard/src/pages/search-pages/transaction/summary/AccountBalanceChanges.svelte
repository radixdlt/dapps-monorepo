<script lang="ts">
  import Address from '@components/_base/address/Address.svelte'
  import Divider from '@components/_base/divider/Divider.svelte'
  import NftImage from '@components/_base/nft-image/NftImage.svelte'
  import TokenIcon from '@components/_base/token-icon/TokenIcon.svelte'
  import Change from './Change.svelte'
  import BigNumber from 'bignumber.js'
  import { xrdAddress } from '@stores'

  type _BalanceChange<T extends 'fungible' | 'non-fungible' | 'fee'> = {
    type: T
    token: {
      address: string
      icon?: string
      name?: T extends 'fee' ? 'Radix (XRD)' : string
    } & (T extends 'non-fungible'
      ? {
          id: string
          resourceName?: string
        }
      : {})
    change: T extends 'fungible' | 'fee' ? string : 'added' | 'removed'
  }

  type FungibleBalanceChange = _BalanceChange<'fungible'>
  type NonFungibleBalanceChange = _BalanceChange<'non-fungible'>
  type FeeBalanceChange = _BalanceChange<'fee'>

  type BalanceChange =
    | FungibleBalanceChange
    | NonFungibleBalanceChange
    | FeeBalanceChange

  export let account: string
  export let balanceChanges: BalanceChange[]
</script>

<div class="balance-changes">
  <div class="header">
    <Address value={account} short />
  </div>

  <div class="changes">
    {#each balanceChanges as change, i}
      <div class="icon">
        {#if change.type === 'non-fungible'}
          <NftImage url={change.token.icon} --size="2.3rem" />
        {:else}
          <TokenIcon
            isXrd={change.token.address === $xrdAddress}
            iconUrl={change.token.icon}
            --size="2rem"
          />
        {/if}
      </div>

      <div class="name-and-amount dotted-overflow">
        {#if change.type === 'non-fungible'}
          <a href={`/nft/${change.token.address}:${change.token.id}`}>
            <div class="non-fungible-name dotted-overflow">
              <div class="subtext dotted-overflow">
                {change.token.resourceName ?? ''}
              </div>
              <div class="dotted-overflow">
                {change.token.name ?? ''}
              </div>
            </div>
          </a>
        {:else}
          <a href={`/resource/${change.token.address}`}>
            <div class="fungible-name dotted-overflow">
              {change.token.name ?? ''}
            </div>
          </a>
        {/if}

        {#if change.type === 'fee'}
          <div class="fee-balance-change">
            <Change change={new BigNumber(change.change)} />
            <div class="subtext">Transaction Fee</div>
          </div>
        {:else}
          <Change
            change={change.type === 'fungible'
              ? new BigNumber(change.change)
              : change.change}
          />
        {/if}
      </div>

      {#if i !== balanceChanges.length - 1}
        <div class="divider">
          <Divider />
        </div>
      {/if}
    {/each}
  </div>
</div>

<style lang="scss">
  .balance-changes {
    border-radius: var(--border-radius-lg);
    border: var(--border) var(--theme-border);

    .header {
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-grey-4);
      padding: var(--spacing-lg);
    }

    .changes {
      display: grid;
      grid:
        'icon    name-and-amount'
        'divider divider'
        / 3rem auto;
      padding: var(--spacing-xl);

      .icon {
        grid-area: icon;
        grid-row: span 2;
        display: flex;
        justify-content: center;
      }

      .name-and-amount {
        grid-area: name-and-amount;
        grid-row: span 2;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .fungible-name {
          font-weight: var(--font-weight-bold-2);
        }

        .non-fungible-name {
          display: flex;
          flex-direction: column;
        }

        .fee-balance-change {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
      }
      .divider {
        grid-area: divider;
        grid-row: span 2;
      }
    }
  }
</style>
