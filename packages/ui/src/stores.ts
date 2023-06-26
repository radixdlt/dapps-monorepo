import { derived, writable } from 'svelte/store'
import { writable as localStorageStore } from 'svelte-local-storage-store'
import type { NetworkConfigurationResponse } from '@radixdlt/babylon-gateway-api-sdk'
import { isMobile as isMobileFn } from '@utils'

export type Account = {
  label: string
  address: string
  displayed: string
  appearanceId?: number
}

export const accounts = writable<Account[]>([])

export const selectedAccount = writable<Account | undefined>(undefined)

export const connected = derived(
  [accounts],
  ([accounts]) => accounts.length > 0
)

export const storage = localStorageStore('storage', { theme: 'light' })

export const networkConfiguration = writable<
  NetworkConfigurationResponse | undefined
>()

export const xrdAddress = derived(networkConfiguration, (config) =>
  config?.well_known_addresses ? config.well_known_addresses['xrd'] : undefined
)

export const showSidebar = writable(false)
export const isMobileDevice = writable(isMobileFn())
