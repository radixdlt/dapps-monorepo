import type { SignedChallenge } from '@radixdlt/radix-dapp-toolkit'
import { fetchWrapper } from '@utils'

export const authApi = {
  login: (signedChallenge: SignedChallenge) =>
    fetchWrapper<{ authToken: string }>(
      fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signedChallenge)
      })
    ).map(({ data }) => data.authToken),
  createChallenge: () =>
    fetchWrapper<{ challenge: string }>(fetch('/api/auth/challenge')).map(
      ({ data }) => data.challenge
    ),
  renewAuthToken: () =>
    fetchWrapper<{ authToken: string }>(
      fetch('/api/auth/renew', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    ).map(({ data }) => data.authToken)
} as const
