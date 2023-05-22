import { AuthController } from '../auth/controller'
import { UserModel } from '../user/model'

export const ValidatorController = ({
  userModel = UserModel(),
  authController = AuthController({})
}: Partial<{
  userModel: UserModel
  authController: AuthController
}>) => {
  const getAll = (authToken: string | null) =>
    authController
      .isValid(authToken)
      .asyncAndThen((identityAddress) =>
        userModel
          .getById(identityAddress)
          .map((user) => user?.bookmarkedValidators ?? [])
      )

  const add = (authToken: string | null, validatorAddress: string) =>
    authController
      .isValid(authToken)
      .asyncAndThen((identityAddress) =>
        userModel
          .addBookmarkedValidator(identityAddress, validatorAddress)
          .map((user) => user?.bookmarkedValidators ?? [])
      )

  const remove = (authToken: string | null, validatorAddress: string) =>
    authController
      .isValid(authToken)
      .asyncAndThen((identityAddress) =>
        userModel.removeBookmarkedValidator(identityAddress, validatorAddress)
      )

  return { getAll, add, remove }
}
