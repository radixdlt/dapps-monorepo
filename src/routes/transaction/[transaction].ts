import type { RequestHandler } from './__types/[transaction]'
import { MAINNET_URL } from '../../constants'

export const GET: RequestHandler = async ({ params }) => {
    const response = await fetch(`${MAINNET_URL}/transaction/status`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            network_identifier: {
                network: "mainnet"
            },
            transaction_identifier: {
                hash: params.transaction
            }
        })
    })

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