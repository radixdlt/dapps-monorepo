import {
  InstructionList,
  TransactionManifest
} from '@radixdlt/radix-engine-toolkit'
import { getSendNFTManifest, getSendTokenManifest } from './manifests'

describe('send tokens manifests', () => {
  it('should create a send tokens manifest', async () => {
    const stringManifest = getSendTokenManifest(
      'resource_tdx_c_1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq40v2wv',
      'account_tdx_c_1pxv8mfjgtac0wjhx7ly749c3swxjj2rajwq8j35mlz4sn4dlzv',
      'account_tdx_c_1pxv3acp0u7aplxsxm0hecwvza2a7kjtk3sgk7ka8kkaq4hnyfj',
      500
    )

    let manifest = new TransactionManifest(
      new InstructionList.StringInstructions(stringManifest),
      []
    )

    await expect(
      manifest.convert(InstructionList.Kind.Parsed, 12)
    ).resolves.toBeDefined()
  })

  it('should create a send NFT manifest', async () => {
    const stringManifest = getSendNFTManifest(
      [
        {
          resourceAddress:
            'resource_tdx_c_1qtwgqa7fjg9e2ht57ag8rzsezll44u5hwzldfhsvel5qv25wxf',
          id: '#14#'
        },
        {
          resourceAddress:
            'resource_tdx_c_1qtu6xqcmm6wdfxdxfn05ed6ns5yhfygtc2qf52me6d3qmtvdnt',
          id: '#2#'
        }
      ],
      'account_tdx_c_1pxv8mfjgtac0wjhx7ly749c3swxjj2rajwq8j35mlz4sn4dlzv',
      'account_tdx_c_1pxv3acp0u7aplxsxm0hecwvza2a7kjtk3sgk7ka8kkaq4hnyfj'
    )

    let manifest = new TransactionManifest(
      new InstructionList.StringInstructions(stringManifest),
      []
    )

    await expect(
      manifest.convert(InstructionList.Kind.Parsed, 12)
    ).resolves.toBeDefined()
  })
})
