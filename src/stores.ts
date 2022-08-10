import { writable } from 'svelte/store'
import type { Account, UserInfo } from './mock-sdk'

export const accounts = writable<UserInfo['accounts']>(undefined)

export const selectedAccount = writable<Account>(undefined)
