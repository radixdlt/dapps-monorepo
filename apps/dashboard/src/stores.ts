import type { ErrorResponse } from '@common/gateway-sdk'
import { writable } from 'svelte/store'

export const errorPage = writable<ErrorResponse | undefined>()
