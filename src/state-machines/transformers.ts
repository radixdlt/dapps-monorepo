import type { EntityOverviewTransformed } from '@queries/transformations'
import { getNFTAddress } from '@utils'

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
        ? `${symbol} (${name})`
        : symbol || name || overview.address

    const next = {
      key,
      value: overview.amount,
      address: overview.address
    }

    acc.push(next)

    return acc
  }, [])
  return transformedOverview
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
  return transformedOverview
}
