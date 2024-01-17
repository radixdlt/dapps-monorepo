import { ResultAsync, errAsync, okAsync } from 'neverthrow'
import { typedError } from './error'

const resolveFetch = (fetchable: ReturnType<typeof fetch>) =>
  ResultAsync.fromPromise(fetchable, typedError).mapErr((error) => ({
    reason: 'FailedToFetch',
    error,
    status: 0
  }))

export const fetchWrapper = <R = any, ER = unknown>(
  fetchable: ReturnType<typeof fetch>
): ResultAsync<
  { status: number; data: R },
  { status: number; error?: Error; reason: string; data?: unknown }
> =>
  resolveFetch(fetchable).andThen((response) =>
    ResultAsync.fromPromise<unknown, Error>(response.json(), typedError)
      .mapErr((error) => ({
        status: response.status,
        reason: 'FailedToParseResponseToJson',
        error
      }))
      .andThen((data) =>
        response.ok
          ? okAsync({
              status: response.status,
              data: data as R
            })
          : errAsync({
              status: response.status,
              reason: 'RequestStatusNotOk',
              data: data as ER
            })
      )
  )
