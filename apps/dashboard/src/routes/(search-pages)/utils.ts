import { callApi } from '@api/gateway'
import { getLinkedDappDefinitions } from '@api/utils/two-way-linking'
import type { StateEntityDetailsVaultResponseItem } from '@common/gateway-sdk'
import { err, ok } from 'neverthrow'
import { andThen, flatten, map, pipe } from 'ramda'
import type {
  LedgerStateSelector,
  StateEntityDetailsOptions
} from '@common/gateway-sdk'
import { handleGatewayResult } from '../../utils'
import type {
  AuthInfo,
  NonFungibleRequirement,
  ResourceRequirement
} from '@api/utils/auth'
import { transformFungibleResource } from '@api/_deprecated/utils/entities/resource'
import { transformNft } from '@api/utils/nfts'
import { getStringMetadata } from '@api/utils/metadata'

export const getDappDefinitionData = ({
  metadata,
  address
}: StateEntityDetailsVaultResponseItem) => ({
  address,
  name: getStringMetadata('name')(metadata),
  iconUrl: getStringMetadata('icon_url')(metadata)
})

export const getAssociatedDapps = (
  entity: Promise<StateEntityDetailsVaultResponseItem>
) => entity.then(getLinkedDappDefinitions).then(map(getDappDefinitionData))

export const getLookupEntity = (
  address: string,
  options?: StateEntityDetailsOptions | undefined,
  ledgerState?: LedgerStateSelector | undefined
) =>
  pipe(
    () =>
      callApi(
        'getEntityDetailsVaultAggregated',
        [address],
        options || {
          dappTwoWayLinks: true,
          nativeResourceDetails: true,
        },
        ledgerState
      ).andThen((entities) =>
        entities.length === 0
          ? err({ message: 'Entity not found.' })
          : ok(entities[0])
      ),
    handleLookupGatewayResult
  )()

export const handleLookupGatewayResult = handleGatewayResult((e) => {
  if (
    e.details?.type === 'InvalidRequestError' &&
    e.details?.validation_errors[0].errors[0].includes(
      "doesn't belong to this network"
    )
  ) {
    return 'The entity you requested belongs to a different network.'
  }
  return e.code === 400 ? 'Invalid address. Please try again.' : e.message
})

export const getResourcesFromAuth = (authInfo: AuthInfo) => {
  let fungibleAddresses: string[] = []
  let nonFungibleAddresses: Record<string, string[]> = {}

  const isNonFungibleRule = (rule: any): rule is NonFungibleRequirement =>
    rule.type === 'NonFungible'

  const isFungibleRule = (rule: any): rule is ResourceRequirement =>
    rule.type === 'Resource'

  const traverse = (obj: any) => {
    for (let key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        traverse(obj[key])
      } else {
        const rule = obj[key]
        if (isNonFungibleRule(rule)) {
          nonFungibleAddresses[rule.non_fungible.resource_address].push(
            rule.non_fungible.local_id.simple_rep
          )
        }

        if (isFungibleRule(rule)) {
          fungibleAddresses.push(rule.resource)
        }
      }
    }
  }

  traverse(authInfo)

  const fungibles = pipe(
    () => callApi('getEntityDetailsVaultAggregated', fungibleAddresses),
    handleGatewayResult((_) => 'Failed to load component.'),
    andThen(map(transformFungibleResource))
  )()

  const nonFungibles = pipe(
    () =>
      Object.keys(nonFungibleAddresses).map((resource) =>
        callApi(
          'getNonFungibleData',
          resource,
          nonFungibleAddresses[resource]
        ).map((entities) => entities.map((entity) => ({ resource, ...entity })))
      ),
    map(handleGatewayResult((_) => 'Failed to load component.')),
    (entities) => Promise.all(entities),
    andThen(flatten),
    andThen(map((entity) => transformNft(entity.resource, entity)))
  )()

  return { fungibles, nonFungibles }
}
