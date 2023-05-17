import { Configuration, StateApi } from '@radixdlt/babylon-gateway-api-sdk'
import { ResultAsync } from 'neverthrow'

export type GatewayService = ReturnType<typeof GatewayService>

export const GatewayService = (
  stateApi = new StateApi(
    new Configuration({ basePath: 'https://rcnet.radixdlt.com' })
  )
) => {
  return {
    getEntityMetadata: (address: string) =>
      ResultAsync.fromPromise(
        stateApi.stateEntityDetails({
          stateEntityDetailsRequest: {
            addresses: [address],
            aggregation_level: 'Vault'
          }
        }),
        (error: any): Error => error
      ).map((response) => response.items[0].metadata.items)
  }
}
