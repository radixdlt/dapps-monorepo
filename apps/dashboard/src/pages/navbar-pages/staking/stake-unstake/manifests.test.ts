import { RadixEngineToolkit } from '@common/ret'
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
      'account_tdx_d_16996e320lnez82q6430eunaz9l3n5fnwk6eh9avrmtmj22e7m9lvl2',
      'validator_tdx_d_1sdercqmrle9e9tz47asy2kwj8d3pd839zfg4gwlsz8az06txkdcghx',
      '500',
      'resource_tdx_d_1tkkywmvpnllj060fqkd2rrg6gjck7peep7mm0m95yx45ce7t70z2h5'
    )
  },
  {
    name: 'multiple stake',
    manifest: getMultipleStakeManifest(
      'account_tdx_d_16996e320lnez82q6430eunaz9l3n5fnwk6eh9avrmtmj22e7m9lvl2',
      [
        {
          validator:
            'validator_tdx_d_1sdercqmrle9e9tz47asy2kwj8d3pd839zfg4gwlsz8az06txkdcghx',
          amount: '500'
        }
      ],
      'resource_tdx_d_1tkkywmvpnllj060fqkd2rrg6gjck7peep7mm0m95yx45ce7t70z2h5'
    )
  },
  {
    name: 'unstake',
    manifest: getUnstakeManifest([
      {
        accountAddress:
          'account_tdx_d_16996e320lnez82q6430eunaz9l3n5fnwk6eh9avrmtmj22e7m9lvl2',
        validatorAddress:
          'validator_tdx_d_1sdercqmrle9e9tz47asy2kwj8d3pd839zfg4gwlsz8az06txkdcghx',
        amount: '500',
        stakeUnitResource:
          'resource_tdx_d_1tkkywmvpnllj060fqkd2rrg6gjck7peep7mm0m95yx45ce7t70z2h5'
      }
    ])
  },
  {
    name: 'claim',
    manifest: getClaimManifest([
      {
        accountAddress:
          'account_tdx_d_16996e320lnez82q6430eunaz9l3n5fnwk6eh9avrmtmj22e7m9lvl2',
        validatorAddress:
          'validator_tdx_d_1sdercqmrle9e9tz47asy2kwj8d3pd839zfg4gwlsz8az06txkdcghx',
        unstakeClaimResource:
          'resource_tdx_d_1tkkywmvpnllj060fqkd2rrg6gjck7peep7mm0m95yx45ce7t70z2h5'
      }
    ])
  }
]

describe('staking manifests', () => {
  fixtures.forEach(({ name, manifest }) => {
    it(`should create ${name} manifest`, async () => {
      expect(
        (
          await RadixEngineToolkit.Instructions.staticallyValidate(
            {
              kind: 'String',
              value: manifest
            },
            13
          )
        ).kind
      ).toEqual('Valid')
    })
  })
})
