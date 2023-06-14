import type { Challenge } from '@prisma/client'
import { config } from '../../config'
import { ResultAsync, errAsync, okAsync } from 'neverthrow'
import { createApiError, type ApiError } from '../../_types'

export const hasChallengeExpired = (
  challenge: Challenge
): ResultAsync<Challenge, ApiError> => {
  const createdAt = challenge.createdAt.getTime()
  const expiresAt = createdAt + config.challenge.expiresInMs
  const hasExpired = Date.now() > expiresAt

  return hasExpired
    ? errAsync(createApiError('challengeExpired', 400)())
    : okAsync(challenge)
}
