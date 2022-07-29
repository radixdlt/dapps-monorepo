import { writable } from 'svelte/store'
import type { UserInfo } from './mock-sdk'

export const accounts = writable<UserInfo['accounts']>(undefined)