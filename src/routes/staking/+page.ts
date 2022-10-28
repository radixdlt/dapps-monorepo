import { queryServer } from '@queries'
import type { PageLoad } from './$types'

export const load: PageLoad = async () => ({
  validators: await queryServer('getValidators')
})
