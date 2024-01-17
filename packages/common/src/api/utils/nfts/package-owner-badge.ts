import type { _NonFungible } from '.'
import { createSystemNftData } from '../nft-data'

export const systemNftData = createSystemNftData({
  name: 'String',
  package: 'String'
})

export type PackageOwnerBadge = _NonFungible<
  'packageOwnerBadge',
  typeof systemNftData
>
