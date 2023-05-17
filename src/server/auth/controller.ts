import type { AppLogger } from '../helpers/logger'
import type { ControllerOutput } from '../_types'
import { AuthModel } from './model'
import { hasChallengeExpired } from './helpers/has-challenge-expired'
import { GatewayService } from './gateway'
import { RolaFactory } from './rola/rola'
import { object, string, z } from 'zod'
import { Proof } from '@radixdlt/radix-dapp-toolkit'

export type VerifyRequestBody = z.infer<typeof VerifyRequestBody>
export const VerifyRequestBody = object({
  proof: Proof,
  challenge: string(),
  address: string(),
  dAppDefinitionAddress: string()
})

export type AuthController = ReturnType<typeof AuthController>
export const AuthController = ({
  authModel = AuthModel(),
  gatewayService = GatewayService(),
  logger,
  expectedOrigin = 'http://localhost:3000'
}: Partial<{
  authModel: AuthModel
  gatewayService: GatewayService
  logger: AppLogger
  expectedOrigin: string
}>) => {
  const rola = RolaFactory(expectedOrigin, gatewayService)

  const createChallenge = (): ControllerOutput<{ challenge: string }> =>
    authModel
      .createChallenge()
      .map((challenge) => ({ data: { challenge }, httpResponseCode: 201 }))

  const verify = ({
    proof,
    address,
    challenge,
    dAppDefinitionAddress
  }: VerifyRequestBody): ControllerOutput<any> => {
    logger?.debug('Verifying signed challenge', {
      proof,
      address,
      challenge,
      dAppDefinitionAddress
    })
    return authModel
      .getAndDelete(challenge)
      .andThen(hasChallengeExpired)
      .andThen((data) =>
        rola({
          challenge: data.challenge,
          proof,
          address,
          dAppDefinitionAddress
        })
      )
      .mapErr(({ reason, jsError }) => ({
        httpResponseCode: 400,
        reason,
        jsError
      }))
      .map(() => ({
        data: {},
        httpResponseCode: 200
      }))
  }

  return { createChallenge, verify, authModel }
}
