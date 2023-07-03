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

describe('Deploy Package Transaction Manifests', () => {
  it('should create a create badge manifest', async () => {
    const stringManifest = getCreateBadgeManifest(
      `account_tdx_22_12xt9uxe39dxdfy9c23vn0qj7eaxs8p3fjjpkr8f48edsfvyk00ck3l`
    )

    let manifest = new TransactionManifest(
      new InstructionList.StringInstructions(stringManifest),
      []
    )

    await expect(
      manifest.convert(InstructionList.Kind.Parsed, 34)
    ).resolves.toBeDefined()
  })

  it('should create deploy package manifest', async () => {
    const faucetSchema = readFileSync(
      join(__dirname, 'faucet.schema')
    ).toString('hex')
    const faucetWasm = readFileSync(join(__dirname, 'faucet.wasm')).toString(
      'hex'
    )

    const sborDecodedSchema = (await RadixEngineToolkit.sborDecode(
      faucetSchema,
      34
    )) as SborValue.ManifestSbor

    const stringManifest = getDeployPackageManifest(
      faucetWasm,
      sborDecodedSchema.manifestString,
      'resource_tdx_22_1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxmaesev',
      '#65#'
    )

    let manifest = new TransactionManifest(
      new InstructionList.StringInstructions(stringManifest),
      [faucetWasm]
    )

    await expect(
      manifest.convert(InstructionList.Kind.Parsed, 34)
    ).resolves.toBeDefined()
  })
})
