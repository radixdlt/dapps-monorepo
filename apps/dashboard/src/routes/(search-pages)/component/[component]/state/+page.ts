import type { PageLoad } from './$types'

export const load: PageLoad = ({ parent }) =>
  parent().then((data) => ({
    state: data.promises.component.then(({ state }) => state)
  }))
