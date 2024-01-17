import type { ResultAsync } from 'neverthrow'
import { errorPage } from './stores'
import type { ErrorResponse } from '@common/utils/gateway-sdk'
import { getAddressPrefix } from '@common/utils/formatting'

export const handleGatewayResult =
  (errorMessage?: (e: ErrorResponse) => string) =>
  <T, E extends ErrorResponse>(result: ResultAsync<T, E>) =>
    result
      .mapErr((e) => {
        errorPage.set({
          ...e,
          message: errorMessage ? errorMessage(e) : e.message
        })
        throw e
      })
      .unwrapOr(undefined as never)

export const addressToRoute = async (address: string) =>
  ({
    account: `/account/${encodeURIComponent(address)}`,
    resource: `/resource/${encodeURIComponent(address)}`,
    package: `/package/${encodeURIComponent(address)}`,
    component: `/component/${encodeURIComponent(address)}`,
    txid: `/transaction/${encodeURIComponent(address)}`,
    validator: `/validator/${encodeURIComponent(address)}`,
    identity: `/identity/${encodeURIComponent(address)}`,
    pool: `/pool/${encodeURIComponent(address)}`
  }[getAddressPrefix(address)] ?? `/component/${encodeURIComponent(address)}`)
