import type { RequestHandler } from './$types'
import { error, json } from '@sveltejs/kit'
import { authController } from '../../../../server/auth/controller'

/** @type {import('./$types').RequestHandler} */
export const GET: RequestHandler = async () => {
  const result = await authController.createChallenge()

  if (result.isErr())
    // @ts-ignore
    throw error(result.error.httpResponseCode, result.error.reason)

  return json(result.value.data, { status: result.value.httpResponseCode })
}
