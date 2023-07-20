import {
  InstructionList,
  RadixEngineToolkit,
  SborValue,
  TransactionManifest
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

    let manifest = new TransactionManifest(
      new InstructionList.StringInstructions(stringManifest),
      []
    )

    await expect(
      manifest.convert(InstructionList.Kind.Parsed, NETWORK_ID)
    ).resolves.toBeDefined()
  })

  it('should create deploy package manifest', async () => {
    const faucetSchema = readFileSync(join(__dirname, 'faucet.rpd')).toString(
      'hex'
    )
    const faucetWasm = readFileSync(join(__dirname, 'faucet.wasm')).toString(
      'hex'
    )

    const sborDecodedSchema = (await RadixEngineToolkit.sborDecode(
      faucetSchema,
      NETWORK_ID
    )) as SborValue.ManifestSbor

    const stringManifest = getDeployPackageManifest(
      faucetWasm,
      sborDecodedSchema.manifestString,
      'resource_tdx_d_1tkx7f4tdf9zlqnhvtjrftddxvpjtvwqshjw5p9v0qslka44un68w6k',
      '#65#'
    )

    let manifest = new TransactionManifest(
      new InstructionList.StringInstructions(stringManifest),
      [faucetWasm]
    )

    await expect(
      manifest.convert(InstructionList.Kind.Parsed, NETWORK_ID)
    ).resolves.toBeDefined()
  })
})
