import { getSingleEntityDetails } from '@api/gateway'
import type { LayoutLoad } from './$types'
import { transformPackage } from '@api/utils/entities/package'
import { getLinkedDappDefinitions } from '@api/utils/two-way-linking'
import { getDappDefinitionData } from '../../utils'
import { map } from 'ramda'

export const prerender = false

export const load: LayoutLoad = ({ params }) => {
  const entity = getSingleEntityDetails(params.package)

  return {
    address: params.package,
    promises: {
      entity,
      package: entity.then(transformPackage),
      associatedDapps: entity
        .then(getLinkedDappDefinitions)
        .then(map(getDappDefinitionData))
    }
  }
}
