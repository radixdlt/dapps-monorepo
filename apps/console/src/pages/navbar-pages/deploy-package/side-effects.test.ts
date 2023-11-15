import {
  ManifestSborStringRepresentation,
  RadixEngineToolkit
} from '@common/ret'
import { getDeployPackageManifest } from './side-effects'
import { readFileSync } from 'fs'
import { join } from 'path'
import { RadixNetwork } from '@common/gateway-sdk'

describe('Deploy Package Transaction Manifests', () => {
  const NETWORK_ID = RadixNetwork.RCnetV3

  it('should create deploy package manifest', async () => {
    const schema = readFileSync(join(__dirname, 'faucet.rpd')).toString('hex')
    const wasm = readFileSync(join(__dirname, 'faucet.wasm')).toString('hex')

    const sborDecodedSchema =
      await RadixEngineToolkit.ManifestSbor.decodeToString(
        Buffer.from(schema, 'hex'),
        NETWORK_ID,
        ManifestSborStringRepresentation.ManifestString
      )

    const stringManifest = getDeployPackageManifest(wasm, sborDecodedSchema, {
      type: 'allowAll'
    })

    const manifest = await RadixEngineToolkit.Instructions.staticallyValidate(
      {
        kind: 'String',
        value: stringManifest
      },
      NETWORK_ID
    )

    await expect(manifest.kind).toEqual('Valid')
  })
})
