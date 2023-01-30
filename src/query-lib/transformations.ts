import type { EntityOverview, EntityResources } from '@io/gateway'

export const transformEntityResources = (res: EntityResources) => {
  const fungible =
    res.fungible_resources?.items?.map((item) => ({
      address: item.address,
      amount: item.amount?.value
    })) ?? []

  const nonFungible =
    res.non_fungible_resources?.items?.map((item) => ({
      address: item.address,
      amount: String(item.amount)
    })) ?? []

  return { fungible, nonFungible }
}

export type EntityResourcesTransformed = ReturnType<
  typeof transformEntityResources
>

export const transformEntityOverview = ({
  resources,
  overview
}: {
  resources: EntityResourcesTransformed['fungible']
  overview: EntityOverview
}) => {
  const withOverviews = overview.entities.map((entity) => {
    const amount = resources?.find(
      (res) => res.address === entity.address
    )?.amount
    return {
      ...entity,
      amount
    }
  })
  const withoutOverviews = resources?.filter(
    (res) => !overview.entities.find((entity) => entity.address === res.address)
  )
  return { withOverviews, withoutOverviews }
}

export type EntityOverviewTransformed = ReturnType<
  typeof transformEntityOverview
>
