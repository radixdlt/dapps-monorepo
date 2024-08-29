import {
  ManifestSborStringRepresentation,
  RadixEngineToolkit
} from '@common/ret'
import { ResultAsync } from 'neverthrow'
import { networkId } from '../network/state'
import { firstValueFrom } from 'rxjs'
import { Buffer } from 'buffer'

export const sborDecode = (hexEncodedSchema: string) =>
  ResultAsync.fromPromise(
    firstValueFrom(networkId).then((id) =>
      RadixEngineToolkit.ManifestSbor.decodeToString(
        Buffer.from(hexEncodedSchema, 'hex'),
        id,
        ManifestSborStringRepresentation.ManifestString
      )
    ),
    (err) => err as Error
  )
