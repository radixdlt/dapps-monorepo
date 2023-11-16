<script lang="ts">
  import type { NonFungibleResource } from '@api/utils/entities/resource'
  import type { NonFungible } from '@api/utils/nfts'
  import { resourcesCacheClient } from '@api/utils/resource-cache-client'
  import type {
    TransactionBalanceChanges,
    TransactionFungibleBalanceChanges,
    TransactionNonFungibleBalanceChanges
  } from '@common/gateway-sdk'
  import { formatTokenValue } from '@utils'
  import BigNumber from 'bignumber.js'

  export let entityAddress: string
  export let type: 'increases' | 'decreases'
  export let balanceChanges: TransactionBalanceChanges

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
    changes: T[]
  ): T[] => changes.filter((change) => change.entity_address === entityAddress)

  $: {
    fungibleChanges = currentEntityChanges(
      balanceChanges.fungible_balance_changes
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
      balanceChanges.non_fungible_balance_changes
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
  <a
    href="/resource/{change.resource_address}"
    class="balance-change"
    class:decrease={type === 'decreases'}
    class:increase={type === 'increases'}
  >
    {type === 'decreases' ? '-' : '+'}
    {formatTokenValue(change.bigNumber).displayValue}

    {fungible?.metadata.standard.symbol?.value ||
      fungible?.metadata.standard.name?.value ||
      ''}
  </a>
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
    {change.nft?.nftData.standard.name?.value || ''}
  </a>
{/each}

<style lang="scss">
  .balance-change {
    display: block;
    text-align: right;
    font-weight: var(--font-weight-bold-2);
    &:not(:last-child) {
      margin-bottom: var(--spacing-md);
    }
    &.increase {
      color: var(--color-radix-green-1);
    }
    &.decrease {
      color: var(--color-radix-error-red-1);
    }
  }

  a:hover {
    text-decoration: underline;
  }
</style>
