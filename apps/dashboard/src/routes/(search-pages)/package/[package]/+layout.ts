import type { LayoutLoad } from './$types'
import { transformPackage } from '@api/utils/entities/package'
import { getAssociatedDapps, getLookupEntity } from '../../utils'

export const load: LayoutLoad = ({ params }) => {
  const entity = getLookupEntity(params.package)
  const _package = entity.then(transformPackage)

  return {
    address: params.package,
    promises: {
      entity,
      package: _package,
      associatedDapps: getAssociatedDapps(entity)
    }
  }
}
