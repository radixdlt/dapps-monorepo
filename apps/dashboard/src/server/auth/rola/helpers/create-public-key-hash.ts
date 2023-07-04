import { Buffer } from 'buffer'
import { blake2b } from '../../helpers/blake2b'
import type { Result } from 'neverthrow'

type HexEncodedPublicKeyHash = string

export const createPublicKeyHash = (
  publicKey: string
): Result<HexEncodedPublicKeyHash, Error> =>
  blake2b(Buffer.from(publicKey, 'hex'))
    .map((hash) => hash.subarray(-29))
    .map((hash) => Buffer.from(hash).toString('hex'))
