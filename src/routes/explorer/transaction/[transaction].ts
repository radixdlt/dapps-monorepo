import type { RequestHandler } from './__types/[transaction]'
import { MAINNET_URL } from '@constants'
import { Gateway } from 'radix-js'

export const GET: RequestHandler = async ({ params }) => {
    const response = await Gateway.transactionStatus(params.transaction)(MAINNET_URL)

    return response ? {
        status: 200,
        body: { tx: await response.json() }
    } : {
        status: 404
    }
}