import type { _Entity } from '../entities'
import type { _NonFungible } from '.'
import type { StateNonFungibleDetailsResponseItem } from '@common/utils/gateway-sdk'
import { createSystemNftData } from '../nft-data'

export const systemNftData = createSystemNftData({
  name: 'String',
  claim_amount: 'String',
  claim_epoch: 'String'
})

export type ClaimNft = _NonFungible<'claimNft', typeof systemNftData>

export const isUnstakeData = (
  data: StateNonFungibleDetailsResponseItem['data']
): data is typeof data & {
  programmatic_json: {
    fields: [
      {
        kind: 'String'
        field_name: 'name'
        value: string
      },
      {
        kind: 'U64'
        type_name: 'Epoch'
        field_name: 'claim_epoch'
        value: string
      },
      {
        kind: 'Decimal'
        field_name: 'claim_amount'
        value: string
      }
    ]
  }
} => (data?.programmatic_json as any)?.type_name === 'UnstakeData'

export const getUnstakeData = (
  data: StateNonFungibleDetailsResponseItem['data']
) => {
  if (!isUnstakeData(data)) return undefined

  return {
    claimEpoch: data.programmatic_json.fields.find(
      ({ field_name }) => field_name === 'claim_epoch'
    )!.value,
    claimAmount: data.programmatic_json.fields.find(
      ({ field_name }) => field_name === 'claim_amount'
    )!.value
  }
}
