import { queryServer } from '../../query-lib'
import type { PageServerLoad } from './$types'

export const prerender = true

export const load: PageServerLoad = async () => ({
  validators: await queryServer('getValidators')
})
