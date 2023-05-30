import {
  InstructionList,
  TransactionManifest
} from '@radixdlt/radix-engine-toolkit'
import { getSendNFTManifest, getSendTokenManifest } from './manifests'

describe('send tokens manifests', () => {
  it('should create a send tokens manifest', async () => {
    const stringManifest = getSendTokenManifest(
      'resource_tdx_22_1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxmaesev',
      'account_tdx_22_168e8u653alt59xm8ple6khu6cgce9cfx9mlza6wxf7qs3wwdv9pzgd',
      'account_tdx_22_12xt9uxe39dxdfy9c23vn0qj7eaxs8p3fjjpkr8f48edsfvyk00ck3l',
      500
    )

    let manifest = new TransactionManifest(
      new InstructionList.StringInstructions(stringManifest),
      []
    )

    await expect(
      manifest.convert(InstructionList.Kind.Parsed, 34)
    ).resolves.toBeDefined()
  })

  it('should create a send NFT manifest', async () => {
    const stringManifest = getSendNFTManifest(
      [
        {
          resourceAddress:
            'resource_tdx_22_1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxmaesev',
          id: '#14#'
        },
        {
          resourceAddress:
            'resource_tdx_22_1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxmaesev',
          id: '#2#'
        }
      ],
      'account_tdx_22_168e8u653alt59xm8ple6khu6cgce9cfx9mlza6wxf7qs3wwdv9pzgd',
      'account_tdx_22_12xt9uxe39dxdfy9c23vn0qj7eaxs8p3fjjpkr8f48edsfvyk00ck3l'
    )

    let manifest = new TransactionManifest(
      new InstructionList.StringInstructions(stringManifest),
      []
    )

    await expect(
      manifest.convert(InstructionList.Kind.Parsed, 34)
    ).resolves.toBeDefined()
  })
})
