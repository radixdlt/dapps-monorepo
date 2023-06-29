import {
  InstructionList,
  TransactionManifest
} from '@radixdlt/radix-engine-toolkit'
import {
  getClaimManifest,
  getMultipleStakeManifest,
  getStakeManifest,
  getUnstakeManifest
} from './manifests'

const fixtures = [
  {
    name: 'stake',
    manifest: getStakeManifest(
      'account_tdx_21_1290ugdynnku7phlmp20sra86k058snstknhcmsrc7xxnk02mxz76et',
      'validator_tdx_21_1sfl4mj40e52t2phtfctjhult4h5f28umkwmhnf8jh5744we8nfg2cn',
      '500',
      'resource_tdx_21_1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxsmgder'
    )
  },
  {
    name: 'multiple stake',
    manifest: getMultipleStakeManifest(
      'account_tdx_21_1290ugdynnku7phlmp20sra86k058snstknhcmsrc7xxnk02mxz76et',
      [
        {
          validator:
            'validator_tdx_21_1sfl4mj40e52t2phtfctjhult4h5f28umkwmhnf8jh5744we8nfg2cn',
          amount: '500'
        }
      ],
      'resource_tdx_21_1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxsmgder'
    )
  },
  {
    name: 'unstake',
    manifest: getUnstakeManifest([
      {
        accountAddress:
          'account_tdx_21_1290ugdynnku7phlmp20sra86k058snstknhcmsrc7xxnk02mxz76et',
        validatorAddress:
          'validator_tdx_21_1sfl4mj40e52t2phtfctjhult4h5f28umkwmhnf8jh5744we8nfg2cn',
        amount: '500',
        stakeUnitResource:
          'resource_tdx_21_1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxsmgder'
      }
    ])
  },
  {
    name: 'claim',
    manifest: getClaimManifest([
      {
        accountAddress:
          'account_tdx_21_1290ugdynnku7phlmp20sra86k058snstknhcmsrc7xxnk02mxz76et',
        validatorAddress:
          'validator_tdx_21_1sfl4mj40e52t2phtfctjhult4h5f28umkwmhnf8jh5744we8nfg2cn',
        amount: '500',
        stakeUnitResource:
          'resource_tdx_21_1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxsmgder'
      }
    ])
  }
]

describe('staking manifests', () => {
  fixtures.forEach(({ name, manifest }) => {
    it(`should create ${name} manifest`, async () => {
      await expect(
        new TransactionManifest(
          new InstructionList.StringInstructions(manifest),
          []
        ).convert(InstructionList.Kind.Parsed, 33)
      ).resolves.toBeDefined()
    })
  })
})
