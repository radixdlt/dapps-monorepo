import type { EntityOverviewTransformed } from '@queries/transformations'

export type TransformWithOverview = ReturnType<typeof transformWithOverview>

export const transformWithOverview = (
  overview?: EntityOverviewTransformed['withOverviews']
) => {
  const transformedOverview = overview?.reduce((acc, overview) => {
    const symbol =
      overview.metadata.items?.find((item) => item.key === 'symbol')?.value ||
      overview.address
    return {
      ...acc,
      [symbol]: overview.amount
    }
  }, {})
  return transformedOverview
}
