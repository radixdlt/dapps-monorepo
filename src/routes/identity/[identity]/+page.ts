import type { PageLoad } from './$types'

export const prerender = false

export const load: PageLoad = ({ params }) => ({
  address: params.identity
})
