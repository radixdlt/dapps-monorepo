import { error, json } from '@sveltejs/kit'
import { ValidatorController } from '../../../server/validators/controller'

const validatorController = ValidatorController({})

/** @type {import('./$types').RequestHandler} */
export const GET = async ({ request }) => {
  const result = await validatorController.getAll(
    request.headers.get('Authorization')
  )

  if (result.isErr()) throw error(401, result.error.reason)

  return json(result.value, { status: 200 })
}

/** @type {import('./$types').RequestHandler} */
export const POST = async ({ request }) => {
  const { validatorAddress } = await request.json()

  const result = await validatorController.add(
    request.headers.get('Authorization'),
    validatorAddress
  )

  if (result.isErr()) throw error(400, result.error.reason)

  return json(result.value, { status: 201 })
}

/** @type {import('./$types').RequestHandler} */
export const DELETE = async ({ request, url }) => {
  const validatorAddress = url.searchParams.get('validatorAddress') as string

  const result = await validatorController.remove(
    request.headers.get('Authorization'),
    validatorAddress
  )

  if (result.isErr()) throw error(400, result.error.reason)

  return json(result.value, { status: 200 })
}
