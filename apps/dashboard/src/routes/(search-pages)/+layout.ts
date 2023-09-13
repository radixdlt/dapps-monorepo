import type { LayoutLoad } from './$types'

export const load: LayoutLoad = ({ url }) => ({
  pageName: url.pathname.split('/').pop()
})
