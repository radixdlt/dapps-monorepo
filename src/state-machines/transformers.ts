import type { EntityOverviewTransformed } from '@queries/transformations'

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
