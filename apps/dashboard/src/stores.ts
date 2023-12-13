import type { ErrorResponse } from '@common/gateway-sdk'
import { writable } from 'svelte/store'

export const bookmarkedValidatorsStore = writable<Record<string, boolean>>({})

export const errorPage = writable<ErrorResponse | undefined>()
