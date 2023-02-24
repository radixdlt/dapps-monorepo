import mocks from '@api/mocks.json'
import { CURRENT_NETWORK } from '../src/network'

export const fakeGatewayCall = (endpoint: keyof typeof mocks) => ({
    url: `${CURRENT_NETWORK.url}${endpoint}`,
    method: 'POST',
    status: 200,
    response: mocks[endpoint]
})