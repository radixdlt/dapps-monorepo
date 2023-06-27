import { writable } from 'svelte/store'

export const bookmarkedValidatorsStore = writable<Record<string, boolean>>({})
