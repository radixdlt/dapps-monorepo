import type { LayoutLoad } from '../$types'

export const load: LayoutLoad = async ({ params }) => ({
  account: params.account
})
