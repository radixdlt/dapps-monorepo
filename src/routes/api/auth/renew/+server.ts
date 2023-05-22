import { error, json } from '@sveltejs/kit'
import { AuthController } from '../../../../server/auth/controller'
import { PUBLIC_APP_ENV } from '$env/static/public'

const authController = AuthController({
  expectedOrigin:
    PUBLIC_APP_ENV === 'development' ? 'http://localhost:5173' : undefined
})

/** @type {import('./$types').RequestHandler} */
export const POST = ({ cookies }) => {
  const result = authController.renewAuthToken(cookies)

  if (result.isErr()) throw error(401, result.error.reason)

  return json(
    { authToken: result.value },
    {
      status: 200
    }
  )
}
