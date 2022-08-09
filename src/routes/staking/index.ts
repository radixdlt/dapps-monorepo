import type { RequestHandler } from './__types'
import { MAINNET_URL } from '@constants'
import { Gateway } from 'radix-js'

export const GET: RequestHandler = async () => {
    const response = await Gateway.validators(MAINNET_URL)

    return response ? {
        status: 200,
        body: { validators: await response.json() }
    } : {
        status: 404
    }
}