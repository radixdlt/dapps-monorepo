import { getSingleEntityDetails } from '@api/gateway'
import type { LayoutLoad } from './$types'
import { getLinkedDappDefinitions } from '@api/utils/two-way-linking'
import { map } from 'ramda'
import { getDappDefinitionData } from '../../utils'
import { getMetadata } from '@api/utils/entities/validator'

export const prerender = false

export const load: LayoutLoad = ({ params }) => {
  const entity = getSingleEntityDetails(params.validator)

  return {
    address: params.validator,
    promises: {
      entity,
      metadata: entity.then((e) => e.metadata).then(getMetadata),
      associatedDapps: entity
        .then(getLinkedDappDefinitions)
        .then(map(getDappDefinitionData))
    }
  }
}
