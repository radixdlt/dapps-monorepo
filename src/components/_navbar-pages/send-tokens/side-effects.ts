import type { EntityResourcesTransformed } from 'src/api/transformations'
import { andThen, pipe } from 'ramda'

import type { EntityOverviewTransformed } from 'src/api/transformations'
import { getNFTAddress } from '@utils'
import { query } from '@api/query'
import {
  getEntityNonFungibleIDs,
  getEntityOverview,
  getEntityResources
} from '@api/gateway'

export type TransformWithOverview = ReturnType<typeof transformWithOverview>

export const transformWithOverview = (
  overview?: EntityOverviewTransformed['withOverviews']
) => {
  const transformedOverview = overview?.reduce<
    Array<{ key: string; value?: string; address: string }>
  >((acc, overview) => {
    const symbol = overview.metadata.items?.find(
      (item) => item.key === 'symbol'
    )?.value
    const name = overview.metadata.items?.find(
      (item) => item.key === 'name'
    )?.value

    const key =
      symbol && name
        ? `${name} (${symbol})`
        : symbol || name || overview.address

    const next = {
      key,
      value: overview.amount,
      address: overview.address
    }

    acc.push(next)

    return acc
  }, [])
  return transformedOverview || []
}

export const transformNFTWithOverview = (
  overview?: Array<
    EntityOverviewTransformed['withOverviews'][0] & {
      non_fungible_ids: {
        items: Array<{
          non_fungible_id: string
        }>
      }
    }
  >
) => {
  const transformedOverview = overview?.reduce<
    Array<{ key: string; value?: string; address: string }>
  >((acc, overview) => {
    const name = overview.metadata.items?.find(
      (item) => item.key === 'name'
    )?.value

    overview.non_fungible_ids.items.forEach(({ non_fungible_id }) =>
      acc.push({
        key: name
          ? `(${name}) ${getNFTAddress(overview.address, non_fungible_id)}`
          : `${getNFTAddress(overview.address, non_fungible_id)}`,
        address: `${overview.address}:${non_fungible_id}`
      })
    )

    return acc
  }, [])
  return transformedOverview || []
}

const transformOverview = async (
  overview: Awaited<ReturnType<ReturnType<typeof getOverview>>>
) => {
  const transformedOverviewsFungible = transformWithOverview(
    overview.fungible.withOverviews
  )
  const transformedOverviewsNonFungible = transformNFTWithOverview(
    overview.nonFungible
  )
  return {
    nonFungible: transformedOverviewsNonFungible,
    fungible: transformedOverviewsFungible
  }
}

const getOverview =
  (accountAddress: string) => async (resources: EntityResourcesTransformed) => {
    const fungible =
      resources.fungible.length > 0
        ? await getEntityOverview(resources.fungible)
        : {
            withOverviews: [],
            withoutOverviews: []
          }

    const nonFungible =
      resources.nonFungible.length > 0
        ? await Promise.all(
            (
              await getEntityOverview(resources.nonFungible)
            ).withOverviews.map(async (nft) => ({
              ...(await getEntityNonFungibleIDs(accountAddress, nft.address)),
              ...nft
            }))
          )
        : []

    return { fungible, nonFungible }
  }

export const getResources = (accountAddress: string) =>
  pipe(
    () => getEntityResources(accountAddress),
    andThen(getOverview(accountAddress)),
    andThen(transformOverview)
  )()
