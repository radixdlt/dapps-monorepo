import type { ResultAsync } from 'neverthrow'
import type { Proof } from '@radixdlt/radix-dapp-toolkit'
import { createSignatureMessage } from './helpers/create-signature-message'
import { verifyProofFactory } from './helpers/verify-proof'
import type { GatewayService } from '../gateway'

export type RolaError = { reason: string; jsError?: Error }

export type VerifyOwnerKeyOnLedgerFn = (
  address: string,
  publicKeyHex: string
) => ResultAsync<undefined, RolaError>

export type RolaInput = {
  challenge: string
  address: string
  proof: Proof
  dAppDefinitionAddress: string
}
export const RolaFactory =
  (expectedOrigin: string, gatewayService: GatewayService) =>
  ({
    address,
    challenge,
    proof,
    dAppDefinitionAddress
  }: RolaInput): ResultAsync<any, RolaError> => {
    return createSignatureMessage({
      dAppDefinitionAddress,
      challenge,
      origin: expectedOrigin
    })
      .andThen(verifyProofFactory(proof))
      .asyncAndThen(() =>
        gatewayService
          .getEntityMetadata(address)
          .map((metadata) => metadata)
          .mapErr(() => ({ reason: 'couldNotVerifyPublicKeyOnLedger' }))
      )
  }
