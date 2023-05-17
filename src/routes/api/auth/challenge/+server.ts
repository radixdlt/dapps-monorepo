import { error, json } from '@sveltejs/kit'
import { AuthController } from '../../../../server/auth/controller'

const authController = AuthController({})

/** @type {import('./$types').RequestHandler} */
export const GET = async () => {
  const result = await authController.createChallenge()

  if (result.isErr())
    throw error(result.error.httpResponseCode, result.error.reason)

  return json(result.value.data, { status: result.value.httpResponseCode })
}
