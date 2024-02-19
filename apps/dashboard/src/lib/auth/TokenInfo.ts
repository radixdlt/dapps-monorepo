import type {
  FungibleResource,
  NonFungibleResource
} from '@api/_deprecated/utils/entities/resource'
import type { NonFungible } from '@api/utils/nfts'

export type TokenInfo = {
  fungibles: Map<string, FungibleResource>
  nonFungibles: Map<`${string}:${string}`, NonFungible>
  nonFungibleResources: Map<string, NonFungibleResource>
}
