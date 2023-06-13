import type { FilterFn } from '@tanstack/svelte-table'

export const includesString: FilterFn<any> = (_, __, value) => {
  if (!value) {
    return true
  }
  return Object.values(_.original).some((v) => {
    if (v === null || v === undefined) {
      return false
    }
    if (typeof v === 'string' || typeof v === 'number') {
      return v.toString().toLowerCase().includes(value.toLowerCase())
    }
  })
}
