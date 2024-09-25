import type { _Entity } from '../entities'
import type { _NonFungible } from '.'

export type ClaimNft = _NonFungible<
  'claimNft',
  ['name', 'claim_amount', 'claim_epoch']
>
