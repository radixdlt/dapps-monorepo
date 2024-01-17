import {
  callApi,
  getTransactionDetailsNew
} from '@common/api/_deprecated/gateway'
import type { LayoutLoad } from './$types'
import { transformResource } from '@common/api/_deprecated/utils/entities/resource'
import { ResultAsync } from 'neverthrow'
import type { ComponentProps } from 'svelte'
import type Summary from '@dashboard-pages/search-pages/transaction/summary/Summary.svelte'
import type {
  TransactionFungibleBalanceChanges,
  TransactionFungibleFeeBalanceChanges,
  TransactionNonFungibleBalanceChanges
} from '@common/utils/gateway-sdk'
import { getNftData } from '@common/api/_deprecated/utils/nft-data'
import { pipe } from 'ramda'
import { handleGatewayResult } from '../../../../utils'

import type { EntityType } from '@common/utils/ret'
import { http } from '@common/utils/http'

const ERROR_MSG = 'Failed to load transaction data.'

const getEntityTypes = async (
  addresses: string[]
): Promise<{ [address: string]: EntityType }> =>
  http.post('/api/ret/entity-type', {
    addresses
  })

const getEntityDetails = (stateVersion?: number) => (addresses: string[]) =>
  pipe(
    () =>
      callApi(
        'getEntityDetailsVaultAggregated',
        addresses,
        undefined,
        stateVersion
          ? {
              state_version: stateVersion
            }
          : undefined
      ),
    handleGatewayResult((_) => ERROR_MSG)
  )()

export const load: LayoutLoad = ({ params, data }) => {
  const details = pipe(
    () => getTransactionDetailsNew(params.transaction),
    handleGatewayResult()
  )()

  const status = pipe(
    () => callApi('getStatus', params.transaction),
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

      const resources = await Promise.all(
        entitiesResult.value.map((resource) =>
          transformResource(resource, getEntityTypes, getEntityDetails())
        )
      )

      const resourceInfo = resources.map((resource) => ({
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

        let balanceChanges: (typeof changes)[number]['balanceChanges'] = []

        if (change.type === 'fungible') {
          balanceChanges.push({
            type: 'fungible',
            change: change.change.balance_change,
            token: {
              address: change.change.resource_address,
              icon: icon?.href,
              name
            }
          })
        } else if (change.type === 'non-fungible') {
          const { name: resourceName } = resourceInfo.find(
            (r) => r.address === resourceAddress
          )!

          change.change.added.forEach((id) => {
            const nft = nftData.find((nft) => nft.non_fungible_id === id)!
            balanceChanges.push({
              type: 'non-fungible',
              change: 'added',
              token: {
                address: change.change.resource_address,
                id: id,
                icon: getNftData(nft.data, 'key_image_url'),
                name: getNftData(nft.data, 'name'),
                resourceName
              }
            })
          })

          change.change.removed.forEach((id) => {
            const nft = nftData.find((nft) => nft.non_fungible_id === id)!

            balanceChanges.push({
              type: 'non-fungible',
              change: 'removed',
              token: {
                address: change.change.resource_address,
                id: id,
                icon: getNftData(nft.data, 'key_image_url'),
                name: getNftData(nft.data, 'name'),
                resourceName
              }
            })
          })
        } else {
          if (change.change.type !== 'FeePayment') return
          balanceChanges.push({
            type: 'fee',
            change: change.change.balance_change,
            token: {
              address: change.change.resource_address,
              icon: icon?.href || '',
              name: 'Radix (XRD)'
            }
          })
        }

        if (existingAccountChange) {
          existingAccountChange.balanceChanges.push(...balanceChanges)
        } else {
          changes.push({
            account: entityAddress,
            balanceChanges: [...balanceChanges]
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
      status,
      balanceChanges,
      manifest: data.promises.manifest
    }
  }
}
