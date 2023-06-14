import {
  InstructionList,
  TransactionManifest
} from '@radixdlt/radix-engine-toolkit'
import {
  getCreateBadgeManifest,
  getDeployPackageManifest
} from './side-effects'
import { readFileSync } from 'fs'
import { resolve, join } from 'path'

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
    const faucet = readFileSync(join(__dirname, 'faucet.wasm')).toString('hex')

    const stringManifest = getDeployPackageManifest(
      faucet,
      `Tuple(Map<String, Tuple>("Faucet", Tuple(Enum(0u8), Tuple(Array<Enum>(Enum(14u8, Array<Enum>(Enum(0u8, 147u8), Enum(0u8, 148u8))), Enum(14u8, Array<Enum>(Enum(1u8, 2u64), Enum(0u8, 145u8))), Enum(13u8, Enum(0u8, 7u8)), Enum(14u8, Array<Enum>()), Enum(14u8, Array<Enum>(Enum(0u8, 160u8)))), Array<Tuple>(Tuple(Enum(1u8, "Faucet"), Enum(1u8, Enum(0u8, Array<String>("vault", "transactions")))), Tuple(Enum(1u8, "Faucet_new_Input"), Enum(1u8, Enum(0u8, Array<String>("arg0", "arg1")))), Tuple(Enum(1u8, "Bytes"), Enum(0u8)), Tuple(Enum(1u8, "Faucet_free_Input"), Enum(1u8, Enum(0u8, Array<String>()))), Tuple(Enum(1u8, "Faucet_lock_fee_Input"), Enum(1u8, Enum(0u8, Array<String>("arg0"))))), Array<Enum>(Enum(0u8), Enum(0u8), Enum(12u8, Tuple(Enum(1u8, 30u32), Enum(1u8, 30u32))), Enum(0u8), Enum(0u8))), Array<Enum>(Enum(1u8, 0u64)), Array<Enum>(), Map<String, Tuple>("free", Tuple(Enum(1u8, Enum(1u8)), Enum(1u8, 3u64), Enum(0u8, 145u8), "Faucet_free"), "lock_fee", Tuple(Enum(1u8, Enum(1u8)), Enum(1u8, 4u64), Enum(0u8, 66u8), "Faucet_lock_fee"), "new", Tuple(Enum(0u8), Enum(1u8, 1u64), Enum(0u8, 132u8), "Faucet_new")), Map<U8, Tuple>(), Map<String, Enum>())))`,
      'resource_tdx_22_1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxmaesev',
      '#65#'
    )

    let manifest = new TransactionManifest(
      new InstructionList.StringInstructions(stringManifest),
      [faucet]
    )

    await expect(
      manifest.convert(InstructionList.Kind.Parsed, 34)
    ).resolves.toBeDefined()
  })
})
