import { getSingleEntityDetails } from '@api/gateway'
import type { PageLoad } from './$types'
import type {
  ReplaceProperty,
  StateEntityDetailsResponseComponentDetails,
  StateEntityDetailsResponseItem
} from '@radixdlt/babylon-gateway-api-sdk'
import { error } from '@sveltejs/kit'

export const prerender = false

export const load: PageLoad = ({ params }) => ({
  address: params.component,
  promises: {
    details: getSingleEntityDetails(params.component).then(
      (details) =>
        details as ReplaceProperty<
          StateEntityDetailsResponseItem,
          'details',
          StateEntityDetailsResponseComponentDetails
        >
    )
  }
})
