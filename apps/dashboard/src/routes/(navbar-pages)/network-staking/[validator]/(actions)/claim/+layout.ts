import { derived } from 'svelte/store'
import type { LayoutLoad } from './$types'
import BigNumber from 'bignumber.js'

export const load: LayoutLoad = ({ parent }) =>
  parent().then(async (data) => {
    const stakes = await data.stakes

    const readyToClaim = derived(stakes, ($stakes) =>
      $stakes.then((stakes) =>
        stakes
          .map(({ account, validator, readyToClaim }) => ({
            account,
            validator,
            xrdAmount: readyToClaim
          }))
          .filter(({ xrdAmount }) => !new BigNumber(xrdAmount).eq(0))
      )
    )

    return {
      readyToClaim
    }
  })
