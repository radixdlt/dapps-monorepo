import { derived, writable } from 'svelte/store'
import { writable as localStorageStore } from 'svelte-local-storage-store'

export type Account = {
  label: string
  address: string
  appearanceId?: number
}

export const accounts = writable<Account[]>([])

export const selectedAccount = writable<Account | undefined>(undefined)

export const connected = derived(
  [accounts],
  ([accounts]) => accounts.length > 0
)

export const storage = localStorageStore('storage', { theme: 'light' })

export const theme = writable<'light'>('light')
