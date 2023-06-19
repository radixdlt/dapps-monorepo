import {
  InstructionList,
  TransactionManifest
} from '@radixdlt/radix-engine-toolkit'
import { getTxManifest } from './side-effects'

describe('dApp definition TX manifest', () => {
  it('should create tx manifest with empty values', async () => {
    const stringManifest = getTxManifest(
      `account_tdx_22_12xt9uxe39dxdfy9c23vn0qj7eaxs8p3fjjpkr8f48edsfvyk00ck3l`,
      [],
      []
    )

    let manifest = new TransactionManifest(
      new InstructionList.StringInstructions(stringManifest),
      []
    )

    await expect(
      manifest.convert(InstructionList.Kind.Parsed, 34)
    ).resolves.toBeDefined()
  })

  it('should create tx manifest', async () => {
    const stringManifest = getTxManifest(
      `account_tdx_22_12xt9uxe39dxdfy9c23vn0qj7eaxs8p3fjjpkr8f48edsfvyk00ck3l`,
      [
        {
          address:
            'resource_tdx_22_1nfxxxxxxxxxxvdrwnrxxxxxxxxx004365253834xxxxxxxxx5dhcfz',
          requiredProof:
            'resource_tdx_22_1nf5w888fzvwe4syy7xf6fcuk6z5ce7l87ghkz0zx2c9886vatp3fwh:#1#'
        }
      ],
      [
        {
          key: 'name',
          value: 'dApp'
        },
        {
          key: 'description',
          value: 'dApp'
        }
      ]
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
