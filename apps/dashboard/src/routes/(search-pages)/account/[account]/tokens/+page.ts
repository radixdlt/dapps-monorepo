import { transformResources } from '@api/utils/resources'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ parent }) => {
  return {
    promises: {
      account: parent()
        .then((data) => data.promises.entityDetails)
        .then((entityDetails) =>
          transformResources()()([entityDetails], { nfts: false })
        )
    }
  }
}
