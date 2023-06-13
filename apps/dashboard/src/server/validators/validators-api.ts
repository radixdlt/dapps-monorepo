import { fetchWrapper } from '@utils'
import { authApi } from '../auth/auth-api'

export const bookmarkedValidatorsApi = {
  getAll: () =>
    authApi.renewAuthToken().andThen((authToken) =>
      fetchWrapper<string[]>(
        fetch('/api/validators', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`
          }
        })
      ).map(({ data }) => data)
    ),

  create: (validatorAddress: string) =>
    authApi.renewAuthToken().andThen((authToken) =>
      fetchWrapper<string[]>(
        fetch('/api/validators', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`
          },
          body: JSON.stringify({ validatorAddress })
        })
      ).map(({ data }) => data)
    ),

  remove: (validatorAddress: string) =>
    authApi.renewAuthToken().andThen((authToken) =>
      fetchWrapper<string[]>(
        fetch(`/api/validators/${validatorAddress}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`
          }
        })
      ).map(({ data }) => data)
    )
} as const
