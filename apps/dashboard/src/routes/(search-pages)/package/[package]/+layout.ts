import { getSingleEntityDetails } from '@api/gateway'
import type { LayoutLoad } from './$types'
import { transformPackage } from '@api/utils/entities/package'
import { getAssociatedDapps } from '../../utils'

export const load: LayoutLoad = ({ params }) => {
  const entity = getSingleEntityDetails(params.package)

  return {
    address: params.package,
    promises: {
      entity,
      package: entity.then(transformPackage),
      associatedDapps: getAssociatedDapps(entity)
    }
  }
}
