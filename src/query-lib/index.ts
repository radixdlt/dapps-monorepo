import { queryFn, querySvelte, mutateSvelte } from 'svelte-samlat'
import * as queries from './queries'
import * as mutations from './mutations'
import WalletSdk, { Network } from '@radixdlt/wallet-sdk'

export const getWalletSDK = () =>
  WalletSdk({
    networkId: Network.Adapanet,
    dAppId: 'radixdlt.dashboard.com'
  })

export const query = querySvelte(queryFn(queries))
export const queryServer = queryFn(queries)
export const mutate = mutateSvelte(queryFn(mutations))
export const mutateServer = queryFn(mutations)
