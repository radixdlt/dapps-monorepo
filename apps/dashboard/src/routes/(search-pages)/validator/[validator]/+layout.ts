import { getSingleEntityDetails } from '@api/gateway'
import type { LayoutLoad } from './$types'
import { getAssociatedDapps } from '../../utils'
import { getMetadata } from '@api/utils/entities/validator'

export const prerender = false

export const load: LayoutLoad = ({ params }) => {
  const entity = getSingleEntityDetails(params.validator)

  return {
    address: params.validator,
    promises: {
      entity,
      metadata: entity.then((e) => e.metadata).then(getMetadata),
      associatedDapps: getAssociatedDapps(entity)
    }
  }
}
