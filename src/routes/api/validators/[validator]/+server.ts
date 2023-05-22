import { error, json } from '@sveltejs/kit'
import { ValidatorController } from '../../../../server/validators/controller'

const validatorController = ValidatorController({})

/** @type {import('./$types').RequestHandler} */
export const DELETE = async ({ request, params }) => {
  const validatorAddress = params.validator
  const result = await validatorController.remove(
    request.headers.get('Authorization'),
    validatorAddress
  )
  if (result.isErr()) throw error(400, result.error.reason)

  return json(result.value, { status: 200 })
}
