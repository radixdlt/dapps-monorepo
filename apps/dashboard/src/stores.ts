import { writable } from 'svelte/store'

export const bookmarkedValidatorsStore = writable<Record<string, boolean>>({})

export const errorPage = writable<
  | {
      status?: number
      message: string
      traceId?: string
    }
  | undefined
>()
