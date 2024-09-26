import type { LayoutLoad } from './$types'
import { andThen, pipe } from 'ramda'
import { transformAccount } from '@api/utils/entities/component/account'
import { getLookupEntity, getResourcesFromAuth } from '../../utils'
import { produceSummary } from '@dashboard/lib/summary/summary'

export const load: LayoutLoad = ({ params }) => {
  const account = pipe(
    () => getLookupEntity(params.account),
    andThen(transformAccount)
  )()

  const {
    stateVersion,
    stakeInfo,
    poolData,
    fungibleResources,
    nonFungibleResources,
    nfts
  } = produceSummary(account)

  return {
    address: params.account,
    promises: {
      stateVersion,
      account,
      stakeInfo,
      poolData,
      fungibleResources,
      nonFungibleResources,
      nfts,
      authResources: account.then(({ auth }) => getResourcesFromAuth(auth))
    }
  }
}
