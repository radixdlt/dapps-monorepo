import { createSystemMetadata } from '@api/utils/metadata'
import type { Resource, standardMetadata } from '..'
import { networkConfiguration } from '@stores'

export const systemMetadata = createSystemMetadata({
  name: 'String',
  description: 'String',
  tags: 'StringArray',
  icon_url: 'Url'
})

export type PackageOwnerBadgeCollection = Resource<
  'non-fungible',
  typeof standardMetadata & typeof systemMetadata
> & {
  nonFungibleType: 'package-owner-badge-collection'
}

export const isPackageOwnerBadgeCollection = (
  nonFungibleResourceAddress: string
) => {
  let resolve: (value: boolean) => void

  const promise = new Promise<boolean>((res) => {
    resolve = res
  })

  let unsub = networkConfiguration.subscribe((config) => {
    if (config) {
      if (
        config?.well_known_addresses.package_owner_badge ===
        nonFungibleResourceAddress
      ) {
        resolve(true)
      } else {
        resolve(false)
      }
    }
  })

  return promise.then((result) => {
    unsub()
    return result
  })
}
