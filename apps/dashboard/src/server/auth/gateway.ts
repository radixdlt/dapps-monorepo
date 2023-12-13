import { ResultAsync } from 'neverthrow'
import { getSingleEntityDetails } from '@api/_deprecated/gateway'

export type GatewayService = ReturnType<typeof GatewayService>

export const GatewayService = () => {
  return {
    getEntityOwnerKeys: (address: string) =>
      ResultAsync.fromPromise(
        getSingleEntityDetails(address),
        (error: any): Error => error
      ).map(
        (response) =>
          response?.metadata?.items.find((item) => item.key === 'owner_keys')
            ?.value.raw_hex ?? ''
      )
  }
}
