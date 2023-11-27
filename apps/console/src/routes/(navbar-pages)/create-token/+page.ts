import type { PageLoad } from './$types'

export const prerender = false

export const load: PageLoad = ({ url }) => ({
  action: url.searchParams.get('action') as string
})
