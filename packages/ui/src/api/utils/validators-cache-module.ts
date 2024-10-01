import { BehaviorSubject } from 'rxjs'
import { callApi } from '@api/gateway'
import { getStringMetadata } from './metadata'

export const ValidatorsCacheModule = () => {
  const isLoading = new BehaviorSubject<boolean>(false)
  const validators = new Map<
    string,
    {
      address: string
      poolUnitResourceAddress: string
      iconUrl: string
      name: string
    }
  >()
  const queriedValidators = new Set<string>()

  const queryValidators = (addresses: string[]) => {
    const addressesToQuery = addresses.filter(
      (address) => !queriedValidators.has(address)
    )
    addressesToQuery.forEach((address) => queriedValidators.add(address))
    isLoading.next(true)

    return callApi('getEntityDetailsVaultAggregated', addressesToQuery, {
      explicitMetadata: ['icon_url', 'pool_unit', 'name']
    })
      .map((entities) => {
        entities.forEach((entity) => {
          validators.set(entity.address, {
            address: entity.address,
            poolUnitResourceAddress:
              getStringMetadata('pool_unit')(entity.metadata) || '',
            iconUrl: getStringMetadata('icon_url')(entity.metadata) || '',
            name: getStringMetadata('name')(entity.metadata) || ''
          })
        })
      })
      .map(() => {
        isLoading.next(false)
      })
  }

  return {
    validators,
    isLoading$: isLoading.asObservable(),
    queryValidators
  }
}

export const validatorsCacheModule = ValidatorsCacheModule()
