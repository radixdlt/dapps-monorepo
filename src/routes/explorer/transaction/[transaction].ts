import type { RequestHandler } from './__types/[transaction]'
import { MAINNET_URL } from '../../../constants'
import { transactionStatus } from 'radix-js'

export const GET: RequestHandler = async ({ params }) => {
    const response = await transactionStatus(params.transaction, MAINNET_URL)

    const tx = await response.json()

    if (response) {
        return {
            status: 200,
            headers: {},
            body: { tx }
        }
    }

    return {
        status: 404
    }
}