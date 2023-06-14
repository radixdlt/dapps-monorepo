import { CURRENT_NETWORK } from '../../src/network'
import { GatewayApiClient } from '@radixdlt/babylon-gateway-api-sdk'

const gatewayApi = GatewayApiClient.initialize({
  basePath: CURRENT_NETWORK?.url
})

export const getTransactionDetails = (
  intentHashHex: string,
  optIns?: Parameters<typeof gatewayApi.transaction.getCommittedDetails>[1]
) =>
  gatewayApi.transaction
    .getCommittedDetails(intentHashHex, optIns)
    .then((res) => ({
      epoch: res.transaction.epoch,
      round: res.transaction.round,
      status: res.transaction.transaction_status,
      date: res.transaction.confirmed_at,
      fee: res.transaction.fee_paid,
      message: res.transaction.message_hex,
      encodedManifest: res.transaction.raw_hex,
      receipt: res.transaction.receipt,
      createdEntities:
        (res.transaction.receipt?.state_updates as any)?.new_global_entities ||
        [],
      stateVersion: res.transaction.state_version
    }))

export const getSingleEntityDetails = (address: string) =>
  gatewayApi.state.getEntityDetailsVaultAggregated(address)

export const getEntityDetails = (addresses: string[]) =>
  gatewayApi.state.getEntityDetailsVaultAggregated(addresses)

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

export const getNonFungibleData = (address: string, id: string) =>
  gatewayApi.state.innerClient.nonFungibleData({
    stateNonFungibleDataRequest: {
      resource_address: address,
      non_fungible_ids: [id]
    }
  })

export const getNonFungibleIDs = (address: string) =>
  gatewayApi.state.innerClient.nonFungibleIds({
    stateNonFungibleIdsRequest: {
      resource_address: address
    }
  })
