import { ResultAsync } from 'neverthrow'
import { secureRandom } from '../crypto/secure-random'
import { DbClient } from '../db/db-client'
import { config } from '../config'
import { createApiError } from '../_types'

export type AuthModel = ReturnType<typeof AuthModel>
export const AuthModel = (dbClient = DbClient()) => {
  const createChallenge = () => {
    const challenge = secureRandom(config.challenge.byteLength)
      ._unsafeUnwrap()
      .toString('hex')

    return ResultAsync.fromPromise(
      dbClient.challenge.create({ data: { challenge } }),
      createApiError('createChallengeFailed', 500)
    ).map(({ challenge }) => challenge)
  }

  const getAndDelete = (challenge: string) => {
    const result = ResultAsync.fromPromise(
      dbClient.challenge.delete({ where: { challenge } }),
      createApiError('challengeNotFound', 404)
    )

    return result
  }

  return { createChallenge, getAndDelete, dbClient }
}
