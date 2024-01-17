import { fetchWrapper } from '@common/utils/fetch'
import { authApi } from '../auth/auth-api'

export const bookmarkedValidatorsApi = {
  getAll: (serverFetch?: typeof fetch) =>
    authApi.renewAuthToken(serverFetch).andThen((authToken) =>
      fetchWrapper<string[]>(
        (() => serverFetch ?? fetch)()('/api/validators', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`
          }
        })
      ).map(({ data }) => data)
    ),

  create: (validatorAddress: string, serverFetch?: typeof fetch) =>
    authApi.renewAuthToken(serverFetch).andThen((authToken) =>
      fetchWrapper<string[]>(
        (() => serverFetch ?? fetch)()('/api/validators', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`
          },
          body: JSON.stringify({ validatorAddress })
        })
      ).map(({ data }) => data)
    ),

  remove: (validatorAddress: string, serverFetch?: typeof fetch) =>
    authApi.renewAuthToken(serverFetch).andThen((authToken) =>
      fetchWrapper<string[]>(
        (() => serverFetch ?? fetch)()(`/api/validators/${validatorAddress}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`
          }
        })
      ).map(({ data }) => data)
    )
} as const

export const setFavoriteValidator = (
  validatorAddress: string,
  favorite: boolean
) =>
  favorite
    ? bookmarkedValidatorsApi.create(validatorAddress)
    : bookmarkedValidatorsApi.remove(validatorAddress)
