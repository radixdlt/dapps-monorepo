import { RadixEngineToolkit } from '@radixdlt/radix-engine-toolkit'
import { getSendNFTManifest, getSendTokenManifest } from './manifests'
import { RadixNetwork } from '@radixdlt/babylon-gateway-api-sdk'

describe('send tokens manifests', () => {
  const NETWORK_ID = RadixNetwork.RCnetV2
  it('should create a send tokens manifest', async () => {
    const stringManifest = getSendTokenManifest(
      'resource_tdx_d_1tkx7f4tdf9zlqnhvtjrftddxvpjtvwqshjw5p9v0qslka44un68w6k',
      'account_tdx_d_16996e320lnez82q6430eunaz9l3n5fnwk6eh9avrmtmj22e7m9lvl2',
      'account_tdx_d_16996e320lnez82q6430eunaz9l3n5fnwk6eh9avrmtmj22e7m9lvl2',
      500
    )

    const manifest = await RadixEngineToolkit.Instructions.staticallyValidate(
      {
        kind: 'String',
        value: stringManifest
      },
      NETWORK_ID
    )

    await expect(manifest.kind).toEqual('Valid')
  })

  it('should create a send NFT manifest', async () => {
    const stringManifest = getSendNFTManifest(
      [
        {
          resourceAddress:
            'resource_tdx_d_1tkx7f4tdf9zlqnhvtjrftddxvpjtvwqshjw5p9v0qslka44un68w6k',
          id: '#14#'
        },
        {
          resourceAddress:
            'resource_tdx_d_1tkx7f4tdf9zlqnhvtjrftddxvpjtvwqshjw5p9v0qslka44un68w6k',
          id: '#2#'
        }
      ],
      'account_tdx_d_16996e320lnez82q6430eunaz9l3n5fnwk6eh9avrmtmj22e7m9lvl2',
      'account_tdx_d_16996e320lnez82q6430eunaz9l3n5fnwk6eh9avrmtmj22e7m9lvl2'
    )

    const manifest = await RadixEngineToolkit.Instructions.staticallyValidate(
      {
        kind: 'String',
        value: stringManifest
      },
      NETWORK_ID
    )

    await expect(manifest.kind).toEqual('Valid')
  })
})
