import type { SignedChallenge } from '@common/rdt'
import { fetchWrapper } from '@utils'

export const authApi = {
  login: (signedChallenge: SignedChallenge, serverFetch?: typeof fetch) =>
    fetchWrapper<{ authToken: string }>(
      (() => serverFetch ?? fetch)()('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signedChallenge)
      })
    ).map(({ data }) => data.authToken),
  createChallenge: (serverFetch?: typeof fetch) =>
    fetchWrapper<{ challenge: string }>(
      (() => serverFetch ?? fetch)()('/api/auth/challenge')
    ).map(({ data }) => data.challenge),
  renewAuthToken: (serverFetch?: typeof fetch) =>
    fetchWrapper<{ authToken: string }>(
      (() => serverFetch ?? fetch)()('/api/auth/renew', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    ).map(({ data }) => data.authToken)
} as const
