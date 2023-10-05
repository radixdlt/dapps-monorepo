import { callApi } from '@api/gateway'
import { getStringMetadata } from '@api/utils/metadata'
import { getLinkedDappDefinitions } from '@api/utils/two-way-linking'
import type { StateEntityDetailsVaultResponseItem } from '@common/gateway-sdk'
import { err, ok } from 'neverthrow'
import { map, pipe } from 'ramda'
import type {
  LedgerStateSelector,
  StateEntityDetailsOptions
} from '@radixdlt/radix-dapp-toolkit'
import { handleGatewayResult } from '../../utils'

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
        options,
        ledgerState
      ).andThen((entities) =>
        entities.length === 0
          ? err({ message: 'Entity not found.' })
          : ok(entities[0])
      ),
    handleLookupGatewayResult
  )()

export const handleLookupGatewayResult = handleGatewayResult((e) =>
  e.status === 400 ? 'Invalid address. Please try again.' : e.message
)
