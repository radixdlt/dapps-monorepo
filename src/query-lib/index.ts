import { _queryFn } from './_query-fn'
import { _querySvelte } from './_query-svelte'
import * as queries from './queries'
import * as mutations from './mutations'
import { _mutateSvelte } from './_mutate-svelte'

export { makeQueries } from './_make-queries'

export const query = _querySvelte(_queryFn(queries))
export const mutate = _mutateSvelte(_queryFn(mutations))
