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
  const NETWORK_ID = RadixNetwork.RCnetV2
  it('should create a create badge manifest', async () => {
    const stringManifest = getCreateBadgeManifest(
      `account_tdx_d_16996e320lnez82q6430eunaz9l3n5fnwk6eh9avrmtmj22e7m9lvl2`
    )

    const manifest = RadixEngineToolkit.Instructions.staticallyValidate(
      {
        kind: 'String',
        value: stringManifest
      },
      NETWORK_ID
    )

    await expect(manifest).resolves.toBeDefined()
  })

  it('should create deploy package manifest', async () => {
    const faucetSchema = readFileSync(join(__dirname, 'faucet.rpd')).toString(
      'hex'
    )
    const faucetWasm = readFileSync(join(__dirname, 'faucet.wasm')).toString(
      'hex'
    )

    const sborDecodedSchema =
      await RadixEngineToolkit.ManifestSbor.decodeToString(
        Buffer.from(faucetSchema, 'hex'),
        NETWORK_ID,
        ManifestSborStringRepresentation.ManifestString
      )

    const stringManifest = getDeployPackageManifest(
      'account_tdx_d_16996e320lnez82q6430eunaz9l3n5fnwk6eh9avrmtmj22e7m9lvl2',
      faucetWasm,
      sborDecodedSchema,
      'resource_tdx_d_1tkx7f4tdf9zlqnhvtjrftddxvpjtvwqshjw5p9v0qslka44un68w6k',
      '#65#'
    )

    const manifest = RadixEngineToolkit.Instructions.staticallyValidate(
      {
        kind: 'String',
        value: stringManifest
      },
      34
    )

    await expect(manifest).resolves.toBeDefined()
  })
})
