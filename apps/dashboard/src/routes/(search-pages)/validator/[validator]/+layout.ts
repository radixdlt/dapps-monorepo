import type { LayoutLoad } from './$types'
import { getAssociatedDapps, getLookupEntity } from '../../utils'
import { transformMetadata } from '@api/_deprecated/utils/metadata'
import { transformValidator } from '@api/utils/entities/component/validator'

export const load: LayoutLoad = ({ params }) => {
  const entity = getLookupEntity(params.validator)

  return {
    address: params.validator,
    promises: {
      entity,
      validator: entity.then(transformValidator),
      metadata: entity.then((entity) => transformMetadata(entity, []).all),
      associatedDapps: getAssociatedDapps(entity)
    }
  }
}
