import type { GatewayError } from '@api/_deprecated/gateway'
import type { ResultAsync } from 'neverthrow'
import { errorPage } from './stores'

export const handleGatewayResult =
  (errorMessage?: (e: GatewayError) => string) =>
  <T, E extends GatewayError>(result: ResultAsync<T, E>) =>
    result
      .mapErr((e) => {
        errorPage.set({
          ...e,
          message: errorMessage ? errorMessage(e) : e.message
        })
        throw e
      })
      .unwrapOr(undefined as never)
