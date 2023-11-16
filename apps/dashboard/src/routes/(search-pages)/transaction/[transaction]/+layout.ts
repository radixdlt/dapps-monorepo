import { callApi, getTransactionDetailsNew } from '@api/gateway'
import type { LayoutLoad } from './$types'
import { transformResource } from '@api/utils/entities/resource'
import { ResultAsync } from 'neverthrow'
import type { ComponentProps } from 'svelte'
import type Summary from '@dashboard-pages/search-pages/transaction/summary/Summary.svelte'
import type {
  TransactionFungibleBalanceChanges,
  TransactionFungibleFeeBalanceChanges,
  TransactionNonFungibleBalanceChanges
} from '@common/gateway-sdk'
import { getNftData } from '@api/utils/nft-data'
import { pipe } from 'ramda'
import { handleGatewayResult } from '../../../../utils'

export const load: LayoutLoad = ({ params, data }) => {
  const details = pipe(
    () => getTransactionDetailsNew(params.transaction),
    handleGatewayResult()
  )()

  const balanceChangeEntities = details.then(async (tx) => {
    const entities = tx.balanceChanges
      ? Array.from(
          new Set([
            ...tx.balanceChanges.fungible_balance_changes.map(
              (change) => change.resource_address
            ),
            ...tx.balanceChanges.fungible_fee_balance_changes.map(
              (change) => change.resource_address
            ),
            ...tx.balanceChanges.non_fungible_balance_changes.map(
              (change) => change.resource_address
            )
          ])
        )
      : undefined

    return entities
      ? callApi('getEntityDetailsVaultAggregated', entities)
      : undefined
  })

  const balanceChanges = Promise.all([details, balanceChangeEntities]).then(
    async ([tx, entitiesResult]) => {
      if (!tx.balanceChanges || !entitiesResult) return undefined

      if (entitiesResult.isErr()) throw entitiesResult.error

      const resourceInfo = entitiesResult.value
        .map(transformResource)
        .map((resource) => ({
          resource,
          icon: resource.metadata.standard.icon_url?.value,
          name: resource.displayName,
          address: resource.address
        }))

      const nftIds = tx.balanceChanges.non_fungible_balance_changes.map(
        (change) => ({
          resource: change.resource_address,
          ids: [...change.added, ...change.removed]
        })
      )

      const nftDataResult = await ResultAsync.combine(
        nftIds.map(({ resource, ids }) =>
          callApi('getNonFungibleData', resource, ids)
        )
      )

      if (nftDataResult.isErr()) throw nftDataResult.error

      const nftData = nftDataResult.value.flat()

      let changes: NonNullable<
        Awaited<ComponentProps<Summary>['balanceChanges']>
      > = []

      const processBalanceChange = (
        change:
          | {
              type: 'fungible'
              change: TransactionFungibleBalanceChanges
            }
          | {
              type: 'non-fungible'
              change: TransactionNonFungibleBalanceChanges
            }
          | {
              type: 'fee'
              change: TransactionFungibleFeeBalanceChanges
            }
      ) => {
        const resourceAddress = change.change.resource_address
        const entityAddress = change.change.entity_address

        const existingAccountChange = changes.find(
          (c) => c.account === entityAddress
        )

        const { icon, name } = resourceInfo.find(
          (r) => r.address === resourceAddress
        )!

        let balanceChange =
          {} as (typeof changes)[number]['balanceChanges'][number]

        if (change.type === 'fungible') {
          balanceChange = {
            type: 'fungible',
            change: change.change.balance_change,
            token: {
              address: change.change.resource_address,
              icon: icon?.href,
              name
            }
          } as const
        } else if (change.type === 'non-fungible') {
          const { icon, name: resourceName } = resourceInfo.find(
            (r) => r.address === resourceAddress
          )!

          change.change.added.forEach((id) => {
            const nft = nftData.find((nft) => nft.non_fungible_id === id)!

            balanceChange = {
              type: 'non-fungible',
              change: 'added',
              token: {
                address: change.change.resource_address,
                id: id,
                icon: icon?.href,
                name: getNftData(nft.data, 'name'),
                resourceName
              }
            } as const
          })

          change.change.removed.forEach((id) => {
            const nft = nftData.find((nft) => nft.non_fungible_id === id)!

            balanceChange = {
              type: 'non-fungible',
              change: 'removed',
              token: {
                address: change.change.resource_address,
                id: id,
                icon: icon?.href,
                name: getNftData(nft.data, 'name'),
                resourceName
              }
            } as const
          })
        } else {
          if (change.change.type !== 'FeePayment') return
          balanceChange = {
            type: 'fee',
            change: change.change.balance_change,
            token: {
              address: change.change.resource_address,
              icon: icon?.href || '',
              name: 'Radix (XRD)'
            }
          } as const
        }

        if (existingAccountChange) {
          existingAccountChange.balanceChanges.push(balanceChange)
        } else {
          changes.push({
            account: entityAddress,
            balanceChanges: [balanceChange]
          })
        }
      }

      tx.balanceChanges.fungible_balance_changes.forEach((change) =>
        processBalanceChange({ type: 'fungible', change })
      )

      tx.balanceChanges.fungible_fee_balance_changes.forEach((change) =>
        processBalanceChange({ type: 'fee', change })
      )

      tx.balanceChanges.non_fungible_balance_changes.forEach((change) =>
        processBalanceChange({ type: 'non-fungible', change })
      )

      return changes
    }
  )

  return {
    address: params.transaction,
    promises: {
      tx: details,
      balanceChanges,
      manifest: data.promises.manifest
    }
  }
}
