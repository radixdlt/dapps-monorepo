import type { AppLogger } from '../helpers/logger'
import type { ControllerOutput } from '../_types'
import { AuthModel } from './model'
import { hasChallengeExpired } from './helpers/has-challenge-expired'
import { GatewayService } from './gateway'
import { RolaFactory } from './rola/rola'
import { SignedChallenge } from '@radixdlt/radix-dapp-toolkit'
import { CURRENT_NETWORK } from '../../network'
import { err, errAsync } from 'neverthrow'
import { OAuth2 } from './oauth2'
import { UserModel } from '../user/model'
import type { Cookies } from '@sveltejs/kit'

export type AuthController = ReturnType<typeof AuthController>
export const AuthController = ({
  authModel = AuthModel(),
  userModel = UserModel(),
  gatewayService = GatewayService(),
  oAuth2 = OAuth2(),
  logger,
  expectedOrigin = 'http://localhost:5173',
  dAppDefinitionAddress = CURRENT_NETWORK.dappDefAddress,
  networkId = CURRENT_NETWORK.id
}: Partial<{
  authModel: AuthModel
  userModel: UserModel
  gatewayService: GatewayService
  oAuth2: OAuth2
  logger: AppLogger
  expectedOrigin: string
  dAppDefinitionAddress: string
  networkId: number
}>) => {
  const rola = RolaFactory(
    gatewayService,
    expectedOrigin,
    dAppDefinitionAddress,
    networkId
  )

  const createChallenge = (): ControllerOutput<{ challenge: string }> =>
    authModel
      .createChallenge()
      .map((challenge) => ({ data: { challenge }, httpResponseCode: 201 }))

  const login = (
    signedChallenge: SignedChallenge,
    cookies: Cookies
  ): ControllerOutput<{
    authToken: string
    headers: { ['Set-Cookie']: string }
  }> => {
    logger?.debug('Verifying signed challenge', signedChallenge)

    if (!SignedChallenge.safeParse(signedChallenge))
      return errAsync({
        httpResponseCode: 400,
        reason: 'invalidRequestBody'
      })

    return authModel
      .getAndDelete(signedChallenge.challenge)
      .andThen(hasChallengeExpired)
      .andThen(() => rola(signedChallenge))
      .mapErr(({ reason, jsError }) => ({
        httpResponseCode: 400,
        reason,
        jsError
      }))
      .andThen(() =>
        userModel.create({ identityAddress: signedChallenge.address })
      )
      .andThen(() => oAuth2.createTokens(signedChallenge.address))
      .map(({ authToken, refreshToken }) => ({
        data: {
          authToken,
          headers: oAuth2.createRefreshTokenCookie(refreshToken, cookies)
        },
        httpResponseCode: 200
      }))
  }

  const renewAuthToken = (cookies: Cookies) => oAuth2.renewAuthToken(cookies)

  const verifyAuthToken = (authorizationHeaderValue: string | null) => {
    const authToken = (authorizationHeaderValue || '').split(' ')[1]
    return authToken
      ? oAuth2.verifyToken(authToken)
      : err({ reason: 'invalidToken' })
  }

  return {
    createChallenge,
    login,
    renewAuthToken,
    isValid: verifyAuthToken
  }
}
