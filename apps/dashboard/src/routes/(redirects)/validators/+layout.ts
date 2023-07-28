import { redirect } from '@sveltejs/kit'
import type { LayoutLoad } from '../../$types'

export let prerender = false

export const load: LayoutLoad = ({ route, params }) => {
  throw redirect(
    301,
    route
      .id!.split('(redirects)')[1]
      .replace('validators', 'network-staking')
      .replace('[validator]', params.validator!)
  )
}
