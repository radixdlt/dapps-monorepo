import {
  ManifestSborStringRepresentation,
  RadixEngineToolkit
} from '@radixdlt/radix-engine-toolkit'
import {
  getCreateBadgeManifest,
  getDeployPackageManifest
} from './side-effects'
import { readFileSync } from 'fs'
import { join } from 'path'
import { RadixNetwork } from '@radixdlt/babylon-gateway-api-sdk'

describe('Deploy Package Transaction Manifests', () => {
  const NETWORK_ID = RadixNetwork.RCnetV3
  it('should create a create badge manifest', async () => {
    const stringManifest = getCreateBadgeManifest(
      `account_tdx_e_129rwaggxwsvgr5vm4zyx7nw2wj77zg9l88ke09jcpr3ge0h44mejz2`
    )

    const manifest = await RadixEngineToolkit.Instructions.staticallyValidate(
      {
        kind: 'String',
        value: stringManifest
      },
      NETWORK_ID
    )

    await expect(manifest.kind).toEqual('Valid')
  })

  it('should create deploy package manifest', async () => {
    const schema = readFileSync(join(__dirname, 'faucet.rpd')).toString('hex')
    const wasm = readFileSync(join(__dirname, 'faucet.wasm')).toString('hex')

    const sborDecodedSchema =
      await RadixEngineToolkit.ManifestSbor.decodeToString(
        Buffer.from(schema, 'hex'),
        NETWORK_ID,
        ManifestSborStringRepresentation.ManifestString
      )

    const stringManifest = getDeployPackageManifest(
      'account_tdx_e_129rwaggxwsvgr5vm4zyx7nw2wj77zg9l88ke09jcpr3ge0h44mejz2',
      wasm,
      sborDecodedSchema,
      'resource_tdx_e_1nta7wc8jw3f7njv2uuhe898nwll45edm2q5nnzvgga8x2flslcyywf',
      '#65#'
    )

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
