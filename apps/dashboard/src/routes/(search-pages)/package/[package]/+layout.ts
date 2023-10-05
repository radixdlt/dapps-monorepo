import type { LayoutLoad } from './$types'
import { transformPackage } from '@api/utils/entities/package'
import { getAssociatedDapps, getLookupEntity } from '../../utils'

export const load: LayoutLoad = ({ params }) => {
  const entity = getLookupEntity(params.package)

  return {
    address: params.package,
    promises: {
      entity,
      package: entity.then(transformPackage),
      associatedDapps: getAssociatedDapps(entity)
    }
  }
}
