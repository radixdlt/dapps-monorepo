import { Result, err, ok } from 'neverthrow'
import { curve25519 } from '../../../crypto/curve25519'
import type { Proof } from '@radixdlt/radix-dapp-toolkit'

export const verifyProofFactory =
  (proof: Proof) =>
  (
    signatureMessageHex: string
  ): Result<undefined, { reason: string; jsError?: Error }> => {
    if (proof.curve === 'curve25519') {
      try {
        // @ts-ignore: incorrect type definition in EC lib
        const publicKey = curve25519.keyFromPublic(proof.publicKey, 'hex')

        const isValid = publicKey.verify(signatureMessageHex, proof.signature)
        return isValid ? ok(undefined) : err({ reason: 'invalidSignature' })
      } catch (error: any) {
        return err({ reason: 'invalidPublicKey', jsError: error })
      }
    }

    return err({ reason: 'unsupportedCurve' })
  }
