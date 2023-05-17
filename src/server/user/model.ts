import type { Prisma, User as UserType } from '@prisma/client'
import type { DbClient } from '../db/db-client.js'
import { ResultAsync } from 'neverthrow'
import { createApiError, type ApiError } from '../_types.js'

export const UserModel = (dbClient: DbClient) => {
  const create = ({ identityAddress }: Prisma.UserCreateInput) =>
    ResultAsync.fromPromise<UserType, ApiError>(
      dbClient.user.create({ data: { identityAddress } }),
      createApiError('Failed to create user', 400)
    )

  const getById = (identityAddress: string) =>
    ResultAsync.fromPromise<UserType | null, ApiError>(
      dbClient.user.findUnique({ where: { identityAddress } }),
      createApiError('Could not find user', 404)
    )

  return { create, getById }
}
