<script lang="ts">
  import type { NonFungibleResource } from '@common/api/_deprecated/utils/entities/resource'
  import type { NonFungible } from '@common/api/utils/nfts'
  import { resourcesCacheClient } from '@common/api/utils/resource-cache-client'
  import type {
    TransactionBalanceChanges,
    TransactionFungibleBalanceChanges,
    TransactionNonFungibleBalanceChanges
  } from '@common/utils/gateway-sdk'
  import { formatTokenValue } from '@common/utils/formatting'
  import BigNumber from 'bignumber.js'

  export let entityAddress: string
  export let type: 'increases' | 'decreases'
  export let balanceChanges: TransactionBalanceChanges | undefined

  let fungibleChanges: (TransactionFungibleBalanceChanges & {
    bigNumber: BigNumber
  })[] = []
  let nonFungibleChanges: {
    resource_address: string
    nftId: string
    resource: NonFungibleResource | undefined
    nft: NonFungible | undefined
  }[] = []

  const currentEntityChanges = <
    T extends
      | TransactionFungibleBalanceChanges
      | TransactionNonFungibleBalanceChanges
  >(
    changes?: T[]
  ): T[] =>
    (changes || []).filter((change) => change.entity_address === entityAddress)

  $: {
    fungibleChanges = currentEntityChanges(
      balanceChanges?.fungible_balance_changes
    )
      .filter((change) =>
        type === 'decreases'
          ? change.balance_change.startsWith('-')
          : !change.balance_change.startsWith('-')
      )
      .map((change) => ({
        ...change,
        bigNumber: new BigNumber(change.balance_change).abs()
      }))

    nonFungibleChanges = currentEntityChanges(
      balanceChanges?.non_fungible_balance_changes
    )
      .filter((change) =>
        type === 'decreases'
          ? change.removed.length > 0
          : change.added.length > 0
      )
      .map((change) =>
        [...change.added, ...change.removed].map((nftId) => ({
          resource_address: change.resource_address,
          nftId,
          resource: resourcesCacheClient.nonFungibleResources.get(
            change.resource_address
          ),
          nft: resourcesCacheClient.nonFungibleResourcesData.get(
            `${change.resource_address}:${nftId}`
          )
        }))
      )
      .flatMap((x) => x)
  }
</script>

{#each fungibleChanges as change}
  {@const fungible = resourcesCacheClient.fungibleResources.get(
    change.resource_address
  )}
  <div
    class="balance-change"
    class:decrease={type === 'decreases'}
    class:increase={type === 'increases'}
  >
    <span
      >{type === 'decreases' ? '-' : '+'}
      {formatTokenValue(change.bigNumber).displayValue}</span
    >
    <a href="/resource/{change.resource_address}">
      {fungible?.metadata.standard.symbol?.value ||
        fungible?.metadata.standard.name?.value ||
        ''}
    </a>
  </div>
{/each}

{#each nonFungibleChanges as change}
  <a
    href="/resource/{encodeURIComponent(
      `${change.resource_address}:${change.nftId}`
    )}"
    class="balance-change"
    class:decrease={type === 'decreases'}
    class:increase={type === 'increases'}
  >
    {type === 'decreases' ? '-' : '+'}
    {change.resource?.displayName}
  </a>
{/each}

{#if !balanceChanges}
  Balance changes loading... please reload in a few minutes.
{:else if !fungibleChanges.length && !nonFungibleChanges.length}
  -
{/if}

<style lang="scss">
  .balance-change {
    display: block;
    text-align: right;
    font-weight: var(--font-weight-bold-2);
    &:not(:last-child) {
      margin-bottom: var(--spacing-md);
    }
    &.increase,
    &.increase a {
      color: var(--color-radix-green-1);
    }
    &.decrease,
    &.decrease a {
      color: var(--color-radix-error-red-1);
    }
  }

  a:hover {
    text-decoration: underline;
  }
</style>
