import { derived } from 'svelte/store'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = ({ parent }) =>
  parent().then(async (data) => {
    const readyToClaim = derived(data.stakeInfo, ($info) =>
      $info.then(({ readyToClaim }) => readyToClaim)
    )

    return {
      readyToClaim
    }
  })
