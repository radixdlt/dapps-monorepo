import { error, json } from '@sveltejs/kit'
import { AuthController } from '../../../../server/auth/controller'
import { PUBLIC_APP_ENV } from '$env/static/public'

const authController = AuthController({
  expectedOrigin:
    PUBLIC_APP_ENV === 'development' ? 'http://localhost:5173' : undefined
})

/** @type {import('./$types').RequestHandler} */
export const POST = async ({ request, cookies }) => {
  const requestBody = await request.json()
  const result = await authController.login(requestBody, cookies)

  if (result.isErr())
    throw error(result.error.httpResponseCode, result.error.reason)

  const { authToken, headers } = result.value.data

  return json(
    { authToken },
    {
      status: result.value.httpResponseCode,
      headers
    }
  )
}
