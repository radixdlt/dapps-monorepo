import type { LayoutLoad } from './$types'

export const load: LayoutLoad = ({ params }) => ({
  validator: params.validator
})
