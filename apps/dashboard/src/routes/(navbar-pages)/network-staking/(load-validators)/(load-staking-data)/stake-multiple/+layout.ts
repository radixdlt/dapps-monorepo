import { derived } from 'svelte/store'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = ({ parent }) =>
  parent().then((data) => {
    const currentlyStaked = derived(data.stakeInfo, async ($info) => {
      const info = await $info

      return info.staked.reduce<{ [k: string]: string }>((prev, cur) => {
        prev[cur.validator.address] = cur.xrdAmount
        return prev
      }, {})
    })

    return {
      currentlyStaked
    }
  })
