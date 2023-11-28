import type { _Entity } from '../entities'
import type { NonFungible, _NonFungible } from '.'
import type { StateNonFungibleDetailsResponseItem } from '@common/gateway-sdk'
import type { Validator } from '../entities/component/validator'

export type ClaimNft = _NonFungible<
  'claimNft',
  ['name', 'claim_amount', 'claim_epoch']
>

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
