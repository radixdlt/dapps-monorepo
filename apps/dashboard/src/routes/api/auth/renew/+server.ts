import type { RequestHandler } from './$types'
import { error, json } from '@sveltejs/kit'
import { authController } from '../../../../server/auth/controller'

/** @type {import('./$types').RequestHandler} */
export const POST: RequestHandler = ({ cookies }) => {
  const result = authController.renewAuthToken(cookies)

  if (result.isErr()) throw error(401, result.error.reason)

  return json(
    { authToken: result.value },
    {
      status: 200
    }
  )
}
