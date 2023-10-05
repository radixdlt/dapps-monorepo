import type { LayoutLoad } from './$types'
import { getAssociatedDapps, getLookupEntity } from '../../utils'
import { transformMetadata } from '@api/utils/metadata'

export const load: LayoutLoad = ({ params }) => {
  const entity = getLookupEntity(params.validator)

  return {
    address: params.validator,
    promises: {
      entity,
      metadata: entity.then((entity) => transformMetadata(entity, []).all),
      associatedDapps: getAssociatedDapps(entity)
    }
  }
}
