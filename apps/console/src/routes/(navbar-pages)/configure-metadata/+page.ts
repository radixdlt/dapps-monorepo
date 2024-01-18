import type { PageLoad } from './$types'

export const prerender = false

export const load: PageLoad = ({ url }) => ({
  query: url.searchParams.get('q') as string
})
