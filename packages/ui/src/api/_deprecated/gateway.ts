import { getMostRelevantManifestClass } from '../helpers/get-most-relevant-manifest-class'
import { fromPromise, type ResultAsync } from 'neverthrow'
import { CURRENT_NETWORK } from '../../../src/network'
import {
  GatewayApiClient,
  type ErrorResponse,
  type StateEntityDetailsOptions,
  type StateNonFungibleDetailsResponseItem,
  type LedgerStateSelector,
  type StreamTransactionsResponse,
  ManifestClass,
  StreamTransactionsRequestEventFilterItemEventEnum
} from '@common/gateway-sdk'

export const gatewayApi = GatewayApiClient.initialize({
  applicationName: 'Radix Dashboard',
  basePath: CURRENT_NETWORK?.url
})

type RawGatewayError = {
  errorResponse: ErrorResponse
}

const isGatewayError = (error: any): error is RawGatewayError =>
  error.hasOwnProperty('errorResponse')

const handleError = (error: unknown): ErrorResponse => {
  if (isGatewayError(error)) {
    return error.errorResponse
  } else {
    return {
      message: 'Unknown network error.'
    }
  }
}

type MethodsOf<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? T[K] : never
}

function extractMethods<T>(instance: T): MethodsOf<T> {
  const methodNames = Object.getOwnPropertyNames(
    Object.getPrototypeOf(instance)
  )
  const methods: Partial<MethodsOf<T>> = {}

  for (const methodName of methodNames) {
    const method = (instance as any)[methodName]
    if (typeof method === 'function') {
      methods[methodName as keyof T] = method.bind(instance)
    }
  }

  return methods as MethodsOf<T>
}

const api = {
  ...extractMethods(gatewayApi.state),
  ...extractMethods(gatewayApi.stream),
  ...extractMethods(gatewayApi.status),
  ...extractMethods(gatewayApi.transaction),
  ...extractMethods(gatewayApi.statistics)
}

export const callApi = <T extends keyof typeof api>(
  methodName: T,
  ...args: Parameters<(typeof api)[T]>
): ResultAsync<
  Awaited<ReturnType<(typeof api)[T]>>,
  ReturnType<typeof handleError>
> => fromPromise((api[methodName] as any)(...args), handleError)

export const getRecentTransactions = (
  address: string,
  cursor?: string,
  filters?: {
    withdrawnFrom?: string[]
    depositedTo?: string[]
    badges?: string[]
    resources?: string[]
    affectedEntities?: string[]
    transactionType?: ManifestClass
  }
) =>
  gatewayApi.stream.innerClient.streamTransactions({
    streamTransactionsRequest: {
      affected_global_entities_filter: [
        address,
        ...(filters?.affectedEntities ?? [])
      ],
      cursor,
      opt_ins: {
        balance_changes: true
      },
      manifest_badges_presented_filter: filters?.badges,
      manifest_resources_filter: filters?.resources,
      events_filter:
        filters?.withdrawnFrom || filters?.depositedTo
          ? [
              ...(filters?.withdrawnFrom || []).map((address) => ({
                event:
                  StreamTransactionsRequestEventFilterItemEventEnum.Withdrawal,
                address
              })),
              ...(filters?.depositedTo || []).map((address) => ({
                event:
                  StreamTransactionsRequestEventFilterItemEventEnum.Deposit,
                address
              }))
            ]
          : undefined,
      manifest_class_filter: filters?.transactionType
        ? {
            _class: filters?.transactionType,
            match_only_most_specific: true
          }
        : undefined
    }
  })

export const getRecentNetworkTransactions = (
  cursor?: string,
  filters?: {
    withdrawnFrom?: string[]
    depositedTo?: string[]
    badges?: string[]
    resources?: string[]
    affectedEntities?: string[]
    transactionType?: ManifestClass
  }
) =>
  fromPromise(
    gatewayApi.stream.innerClient.streamTransactions({
      streamTransactionsRequest: {
        cursor,
        limit_per_page: 15,
        opt_ins: {
          receipt_output: false,
          balance_changes: true
        },
        manifest_badges_presented_filter: filters?.badges,
        manifest_resources_filter: filters?.resources,
        affected_global_entities_filter: filters?.affectedEntities,
        events_filter:
          filters?.withdrawnFrom || filters?.depositedTo
            ? [
                ...(filters?.withdrawnFrom || []).map((address) => ({
                  event:
                    StreamTransactionsRequestEventFilterItemEventEnum.Withdrawal,
                  address
                })),
                ...(filters?.depositedTo || []).map((address) => ({
                  event:
                    StreamTransactionsRequestEventFilterItemEventEnum.Deposit,
                  address
                }))
              ]
            : undefined,
        manifest_class_filter: filters?.transactionType
          ? {
              _class: filters?.transactionType,
              match_only_most_specific: true
            }
          : undefined
      }
    }),
    handleError
  )

export const getTransactionsFromDate = (
  address: string,
  timestamp: Date,
  cursor?: string
): Promise<StreamTransactionsResponse> => {
  return gatewayApi.stream.innerClient.streamTransactions({
    streamTransactionsRequest: {
      affected_global_entities_filter: [address],
      cursor,
      order: 'Asc',
      from_ledger_state: {
        timestamp
      },
      opt_ins: {
        balance_changes: true
      }
    }
  })
}

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
      stateVersion: res.transaction.state_version,
      balanceChanges: res.transaction.balance_changes
    }))
}

export const getTransactionDetailsNew = (
  intentHashHex: string,
  optIns?: Parameters<typeof gatewayApi.transaction.getCommittedDetails>[1]
) => {
  return callApi('getCommittedDetails', intentHashHex, optIns).map((res) => {
    return {
      epoch: res.transaction.epoch,
      round: res.transaction.round,
      status: res.transaction.transaction_status,
      date: res.transaction.confirmed_at,
      fee: res.transaction.fee_paid,
      message: (res.transaction.message as any)?.content?.value,
      encodedManifest: res.transaction.raw_hex,
      receipt: res.transaction.receipt,
      manifestClass: getMostRelevantManifestClass(
        res.transaction.manifest_classes
      ),
      manifest: res.transaction.manifest_instructions,
      subintents: (res.transaction as any).subintent_details as {
        subintent_hash: string
        manifest_instructions: string
        child_subintent_hashes: string[]
        message?: string
      }[],
      child_subintents: (res.transaction as any)
        .child_subintent_hashes as string[],
      events: JSON.stringify(res.transaction.receipt?.events || '', null, 2),
      affectedEntities: res.transaction.affected_global_entities || [],
      createdEntities:
        ((res.transaction.receipt?.state_updates as any)
          ?.new_global_entities as any[]) || [],
      stateVersion: res.transaction.state_version,
      balanceChanges: res.transaction.balance_changes
    }
  })
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
) => gatewayApi.statistics.getValidatorsUptimeFromTo(addresses, from, to)

export const getNonFungibleLocation = (resource: string, ids: string[]) =>
  gatewayApi.state.getNonFungibleLocation(resource, ids)
