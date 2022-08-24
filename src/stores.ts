import { writable } from 'svelte/store'
import type { Account, UserInfo } from 'radix-js'

export const accounts = writable<UserInfo['accounts']>(undefined)

export const selectedAccount = writable<Account>(undefined)

export const currentPage = writable<'home' | 'staking' | 'explorer'>(undefined)
