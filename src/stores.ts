import { writable } from 'svelte/store'
import { writable as localStorageStore } from 'svelte-local-storage-store'

type Account = {
  label: string
  address: string
  appearanceId: number
}

export const accounts = writable<Account[] | undefined>(undefined)

export const selectedAccount = writable<Account | undefined>(undefined)

export const storage = localStorageStore('storage', { theme: 'light' })
