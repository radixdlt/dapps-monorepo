import { callApi } from '@api/gateway'
import type { LayoutLoad } from './$types'
import { networkConfiguration } from '@stores'
import { errorPage } from '../stores'

export const prerender = false

export const ssr = false

export const load: LayoutLoad = () => {
  callApi('getNetworkConfiguration').then((res) =>
    res.match(networkConfiguration.set, (e) =>
      errorPage.set({
        ...e,
        message: 'Something happened while loading network.'
      })
    )
  )
}
