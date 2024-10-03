import { authController } from '@dashboard/server/auth/controller'
import type { RequestHandler } from './$types'
import { error, json } from '@sveltejs/kit'

export const POST: RequestHandler = async ({ cookies }) => {
  await authController.logout(cookies)

  return json(
    {},
    {
      status: 200
    }
  )
}
