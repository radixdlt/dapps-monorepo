import type { Prisma, User as UserType } from '@prisma/client'
import { DbClient } from '../db/db-client.js'
import { ResultAsync } from 'neverthrow'
import { createApiError, type ApiError } from '../_types'

export type UserModel = ReturnType<typeof UserModel>
export const UserModel = (dbClient = DbClient()) => {
  const create = ({ identityAddress }: Prisma.UserCreateInput) =>
    ResultAsync.fromPromise<UserType, ApiError>(
      dbClient.user.upsert({
        create: { identityAddress },
        update: {},
        where: { identityAddress }
      }),
      createApiError('Failed to create user', 400)
    )

  const addBookmarkedValidator = (
    identityAddress: string,
    validatorAddress: string
  ) =>
    ResultAsync.fromPromise<UserType, ApiError>(
      dbClient.user.update({
        data: { bookmarkedValidators: { push: validatorAddress } },
        where: { identityAddress }
      }),
      createApiError('failedToAddBookmarkedValidator ', 400)
    )

  const removeBookmarkedValidator = (
    identityAddress: string,
    validatorAddress: string
  ) => {
    return ResultAsync.fromPromise<undefined, ApiError>(
      dbClient.$queryRaw`
        UPDATE "public"."User"
        SET "bookmarkedValidators"=(array_remove("bookmarkedValidators", ${validatorAddress})) 
        WHERE "identityAddress" = ${identityAddress};
      `,
      createApiError('Could not remove bookmarked validator', 404)
    )
  }

  const getById = (identityAddress: string) =>
    ResultAsync.fromPromise<UserType | null, ApiError>(
      dbClient.user.findUnique({ where: { identityAddress } }),
      createApiError('Could not find user', 404)
    )

  return { create, getById, addBookmarkedValidator, removeBookmarkedValidator }
}
