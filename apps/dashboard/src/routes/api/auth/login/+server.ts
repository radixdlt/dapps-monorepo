import type { RequestHandler } from './$types'
import { error, json } from '@sveltejs/kit'
import { authController } from '../../../../server/auth/controller'
import { appLogger } from '@dashboard/server/helpers/logger'

/** @type {import('./$types').RequestHandler} */
export const POST: RequestHandler = async ({ request, cookies }) => {
  const requestBody = await request.json()
  const result = await authController.login(requestBody, cookies)

  if (result.isErr()) {
    appLogger.error(result.error)
    throw error(result.error.httpResponseCode, result.error.reason)
  }

  const { authToken, headers } = result.value.data

  return json(
    { authToken },
    {
      status: result.value.httpResponseCode,
      headers
    }
  )
}
