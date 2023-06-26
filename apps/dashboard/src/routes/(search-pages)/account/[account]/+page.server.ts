import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const prerender = false

/** @type {import('./$types').PageServerLoad} */
export const load: PageServerLoad = ({ params }) => {
  throw redirect(301, `/account/${params.account}/tokens`)
}
