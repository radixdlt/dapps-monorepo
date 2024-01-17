import type { _NonFungible } from '.'
import { createStandardNftData } from '../nft-data'

export const standardNftData = createStandardNftData({
  name: 'String',
  description: 'String',
  key_image_url: 'String'
})

export type GeneralNft = _NonFungible<'generalNft', typeof standardNftData>
