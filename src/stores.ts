import { writable } from 'svelte/store'
import { writable as localStorageStore } from 'svelte-local-storage-store'
import type { Account, UserInfo } from 'radix-js'

export const accounts = writable<UserInfo['accounts']>(undefined)

export const selectedAccount = writable<Account>(undefined)

export const storage = localStorageStore('storage', { theme: 'dark' })