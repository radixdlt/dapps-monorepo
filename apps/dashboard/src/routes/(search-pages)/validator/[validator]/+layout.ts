import { getSingleEntityDetails } from '@api/gateway'
import type { LayoutLoad } from './$types'
import { getAssociatedDapps } from '../../utils'
import { transformMetadata } from '@api/utils/metadata'

export const prerender = false

export const load: LayoutLoad = ({ params }) => {
  const entity = getSingleEntityDetails(params.validator)

  return {
    address: params.validator,
    promises: {
      entity,
      metadata: entity.then((entity) => transformMetadata(entity, []).all),
      associatedDapps: getAssociatedDapps(entity)
    }
  }
}
