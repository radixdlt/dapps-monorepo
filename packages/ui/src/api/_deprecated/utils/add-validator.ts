import type { StateEntityDetailsResponseItem } from '@common/gateway-sdk'
import { callApi } from '../gateway'
import type { FungibleResource, NonFungibleResource } from './entities/resource'
import { okAsync, type ResultAsync } from 'neverthrow'

export const addValidator = <T extends FungibleResource | NonFungibleResource>(
  resource: T
): ResultAsync<
  T & { validator?: StateEntityDetailsResponseItem },
  { message: string }
> => {
  const validator = resource.metadata.all.find(
    (metadata) =>
      metadata.key === 'validator' &&
      metadata.value.typed.type === 'GlobalAddress' &&
      metadata.value.typed.value.startsWith('validator_')
  )
  if (!validator) {
    return okAsync(resource)
  }

  const validatorAddress = (validator.value.typed as any).value as string

  const validatorEntityResult = callApi('getEntityDetailsVaultAggregated', [
    validatorAddress
  ]).map(([result]) => {
    const addresses = result.metadata.items
      .filter(
        (item) =>
          (item.key === 'claim_nft' || item.key === 'pool_unit') &&
          item.value.typed.type === 'GlobalAddress'
      )
      .map((item) => (item.value.typed as any).value as string)

    if (addresses.includes(resource.address)) {
      return {
        ...resource,
        validator: {
          name: (
            result.metadata.items.find((item) => item.key === 'name')?.value
              .typed as any
          )?.value,
          ...result
        }
      }
    }

    return resource
  })

  return validatorEntityResult
}
