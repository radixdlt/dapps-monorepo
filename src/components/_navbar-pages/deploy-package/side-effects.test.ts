import {
  InstructionList,
  TransactionManifest
} from '@radixdlt/radix-engine-toolkit'
import {
  getCreateBadgeManifest,
  getDeployPackageManifest
} from './side-effects'

describe('Deploy Package Transaction Manifests', () => {
  it('should create a create badge manifest', async () => {
    const stringManifest = getCreateBadgeManifest(
      `account_tdx_c_1pxv8mfjgtac0wjhx7ly749c3swxjj2rajwq8j35mlz4sn4dlzv`
    )

    let manifest = new TransactionManifest(
      new InstructionList.StringInstructions(stringManifest),
      []
    )

    await expect(
      manifest.convert(InstructionList.Kind.Parsed, 12)
    ).resolves.toBeDefined()
  })

  it('should create deploy package manifest', async () => {
    const stringManifest = getDeployPackageManifest(
      'a710f0959d8e139b3c1ca74ac4fcb9a95ada2c82e7f563304c5487e0117095c0',
      '554d6e3a49e90d3be279e7ff394a01d9603cc13aa701c11c1f291f6264aa5791',
      'resource_tdx_c_1qtu6xqcmm6wdfxdxfn05ed6ns5yhfygtc2qf52me6d3qmtvdnt',
      '#65#'
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
