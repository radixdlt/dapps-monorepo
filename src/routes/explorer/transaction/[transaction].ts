import type { RequestHandler } from './__types/[transaction]'
import { Gateway } from 'radix-js'
import { MAINNET_URL } from '@constants'

export const GET: RequestHandler = async ({ params }) => {
  const response = await Gateway.transactionStatus(params.transaction)(MAINNET_URL)

  return response
    ? {
        status: 200,
        body: { tx: await response.json() }
      }
    : {
        status: 404
      }
}
