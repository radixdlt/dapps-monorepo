import { error, json } from '@sveltejs/kit'
import { AuthController } from '../../../../server/auth/controller'
import { PUBLIC_APP_ENV } from '$env/static/public'

const authController = AuthController({
  expectedOrigin:
    PUBLIC_APP_ENV === 'development' ? 'http://localhost:5173' : undefined
})

/** @type {import('./$types').RequestHandler} */
export const GET = async () => {
  const result = await authController.createChallenge()

  if (result.isErr())
    throw error(result.error.httpResponseCode, result.error.reason)

  return json(result.value.data, { status: result.value.httpResponseCode })
}