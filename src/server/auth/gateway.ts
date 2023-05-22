import { Configuration, StateApi } from '@radixdlt/babylon-gateway-api-sdk'
import { ResultAsync } from 'neverthrow'
import { stateApi } from '@api/gateway'

export type GatewayService = ReturnType<typeof GatewayService>

export const GatewayService = () => {
  return {
    getEntityOwnerKeys: (address: string) =>
      ResultAsync.fromPromise(
        stateApi.stateEntityDetails({
          stateEntityDetailsRequest: {
            addresses: [address],
            aggregation_level: 'Vault'
          }
        }),
        (error: any): Error => error
      ).map(
        (response) =>
          response?.items[0]?.metadata?.items.find(
            (item) => item.key === 'owner_keys'
          )?.value.as_string_collection ?? []
      )
  }
}
