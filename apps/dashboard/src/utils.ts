import type { ResultAsync } from 'neverthrow'
import { errorPage } from './stores'
import type { ErrorResponse } from '@common/gateway-sdk'

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
