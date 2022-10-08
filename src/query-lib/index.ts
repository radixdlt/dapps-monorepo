import { _queryFn } from './_query-fn'
import { _querySvelte } from './_query-svelte'
import * as queries from './queries'

export { makeQueries } from './_make-queries'

export const query = _querySvelte(_queryFn(queries))
