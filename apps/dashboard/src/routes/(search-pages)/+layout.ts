import type { LayoutLoad } from './$types'

export const load: LayoutLoad = ({ url }) => ({
  tab: url.pathname.split('/').pop()
})
