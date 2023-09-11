import { getSingleEntityDetails } from '@api/gateway'
import type { LayoutLoad } from './$types'
import { getLinkedDappDefinitions } from '@api/utils/two-way-linking'
import { getDappDefinitionData } from '../../utils'
import { map } from 'ramda'
import { transformComponent } from '@api/utils/entities/component'

export const prerender = false

export const load: LayoutLoad = ({ params }) => {
  const entity = getSingleEntityDetails(params.component)

  return {
    address: params.component,
    promises: {
      entity,
      component: entity.then(transformComponent),
      associatedDapps: entity
        .then(getLinkedDappDefinitions)
        .then(map(getDappDefinitionData))
    }
  }
}
