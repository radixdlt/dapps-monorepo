import { CURRENT_NETWORK } from '../../src/network'
import {
  GatewayApiClient,
  type StateEntityDetailsOptions,
  type StateNonFungibleDetailsResponseItem,
  type LedgerStateSelector
} from '@radixdlt/babylon-gateway-api-sdk'

const gatewayApi = GatewayApiClient.initialize({
  applicationName: 'Radix Dashboard',
  basePath: CURRENT_NETWORK?.url
})

export const getRecentTransactions = (address: string, cursor?: string) =>
  gatewayApi.stream.getTransactionsList([address], cursor)

export const getValidatorsList = () => {
  return gatewayApi.state.getAllValidators()
}

export type GetNonFungibleIdsPageWithDataRequest = {
  componentAddress: string
  resourceAddress: string
  vaultAddress: string
  cursor?: string
  stateVersion?: number
}

export const getValidatorsListWithLedgerState = () =>
  gatewayApi.state.getAllValidatorsWithLedgerState()

export const getGatewayStatus = () => gatewayApi.status.getCurrent()

export const getTransactionDetails = (
  intentHashHex: string,
  optIns?: Parameters<typeof gatewayApi.transaction.getCommittedDetails>[1]
) => {
  return gatewayApi.transaction
    .getCommittedDetails(intentHashHex, optIns)
    .then((res) => ({
      epoch: res.transaction.epoch,
      round: res.transaction.round,
      status: res.transaction.transaction_status,
      date: res.transaction.confirmed_at,
      fee: res.transaction.fee_paid,
      message: (res.transaction.message as any)?.content?.value,
      encodedManifest: res.transaction.raw_hex,
      receipt: res.transaction.receipt,
      events: JSON.stringify(res.transaction.receipt?.events || '', null, 2),
      affectedEntities: res.transaction.affected_global_entities || [],
      createdEntities:
        ((res.transaction.receipt?.state_updates as any)
          ?.new_global_entities as any[]) || [],
      stateVersion: res.transaction.state_version
    }))
}

export const getNetworkConfiguration = () =>
  gatewayApi.status.getNetworkConfiguration()

export const getSingleEntityDetails = (
  address: string,
  options?: StateEntityDetailsOptions
) => gatewayApi.state.getEntityDetailsVaultAggregated(address, options)

export const getEntityDetails = (
  addresses: string[],
  options?: StateEntityDetailsOptions,
  ledgerState?: LedgerStateSelector
) =>
  gatewayApi.state.getEntityDetailsVaultAggregated(
    addresses,
    options,
    ledgerState
  )

export const getEntityNonFungibleIDs = (
  accountAddress: string,
  nftAddress: string,
  vaultAddress: string
) =>
  gatewayApi.state.innerClient.entityNonFungibleIdsPage({
    stateEntityNonFungibleIdsPageRequest: {
      address: accountAddress,
      vault_address: vaultAddress,
      resource_address: nftAddress
    }
  })

export const getEntityNonFungibleVaults = (
  accountAddress: string,
  resourceAddress: string
) =>
  gatewayApi.state.innerClient.entityNonFungibleResourceVaultPage({
    stateEntityNonFungibleResourceVaultsPageRequest: {
      address: accountAddress,
      resource_address: resourceAddress
    }
  })

export const getNonFungibleData = (
  address: string,
  ids: string[]
): Promise<StateNonFungibleDetailsResponseItem[]> =>
  gatewayApi.state.getNonFungibleData(address, ids)

export const getNonFungiblesIdsPageWithData = ({
  componentAddress,
  resourceAddress,
  vaultAddress,
  cursor,
  stateVersion
}: GetNonFungibleIdsPageWithDataRequest) => {
  return gatewayApi.state.innerClient
    .entityNonFungibleIdsPage({
      stateEntityNonFungibleIdsPageRequest: {
        address: componentAddress,
        vault_address: vaultAddress,
        resource_address: resourceAddress,
        at_ledger_state: {
          state_version: stateVersion
        },
        cursor
      }
    })
    .then((res) =>
      Promise.all([
        Promise.resolve(res),
        getNonFungibleData(resourceAddress, res.items)
      ])
    )
}

export const getNonFungibleIDs = (address: string) =>
  gatewayApi.state.getAllNonFungibleIds(address)

export const getValidatorUptime = (
  addresses: string[],
  from?: Date | number,
  to?: Date | number
) =>
  gatewayApi.statistics.innerClient.validatorsUptime({
    validatorsUptimeRequest: {
      validator_addresses: addresses,
      from_ledger_state:
        from !== undefined
          ? from instanceof Date
            ? { timestamp: from }
            : { state_version: from }
          : undefined,
      at_ledger_state:
        to !== undefined
          ? to instanceof Date
            ? { timestamp: to }
            : { state_version: to }
          : undefined
    }
  })

export const getNonFungibleLocation = (resource: string, ids: string[]) =>
  gatewayApi.state.innerClient.nonFungibleLocation({
    stateNonFungibleLocationRequest: {
      resource_address: resource,
      non_fungible_ids: ids
    }
  })
