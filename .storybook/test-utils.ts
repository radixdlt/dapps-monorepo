import mocks from '@api/mocks.json'
import { XRD_NAME } from '@constants'
import { CURRENT_NETWORK } from '../src/network'

const XRD_ADDRESS = 'resource_tdx_24_1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqxrd'

const MOCK_TOKENS = [
    {
        address: XRD_ADDRESS,
        name: XRD_NAME
    },
    {
        address: 'resource_tdx_24_1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqtest',
        name: 'TEST'
    },
    {
        address: 'resource_tdx_24_1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqfloop',
        name: 'FLOOP'
    }
] as const

export const MOCK_ACCOUNTS = [
    {
        label: 'With XRD (acco...7x2w96)',
        address: 'account_tdx_b_1pqdy2mvxrkyycaj0c8c2g8xekf3me27f3hvl9q52cqcs7x2w96'
    },
    {
        label: 'Without XRD (acco...r2ccqa)',
        address: 'account_tdx_b_1pz92kpp5xrqhh09xff6xulwxkluspscqj0etre3tjc5sr2ccqa'
    },
    {
        label: 'dapp definition (acco...r2ccqa)',
        address: 'account_tdx_22_1prtqhxd5mmq2nj3mrhcztxphauy29qeuk5walu49spjsqpjxr6'
    }
] as const

export const mockGatewayCall = (endpoint: keyof typeof mocks) => ({
    url: `${CURRENT_NETWORK.url}${endpoint}`,
    method: 'POST',
    status: 200,
    response: responses[endpoint] ?? mocks[endpoint]
})

const mockResourcesWithXRDValue = (value: string) => ({
    ...mocks['/entity/resources'],
    fungible_resources: {
        items: MOCK_TOKENS.map(token => (
            { address: token.address, amount: { value: token.address === XRD_ADDRESS ? value : '100' } }
        ))
    }
})

const mockEntityOverviewMetadata = (addresses: string[]) => ({
    ...mocks['/entity/overview'],
    entities: addresses.find(address => address === XRD_ADDRESS) ?
        MOCK_TOKENS.map(token => ({ address: token.address, metadata: { items: [{ key: 'name', value: token.name }] } }))
        : [
            {
                address: addresses[2], metadata: {
                    items: [
                        { key: 'account_type', value: 'dapp definition' },
                    ]
                }
            },
        ]
})

// @ts-ignore
const responses: Record<keyof typeof mocks, any> = ({
    '/entity/resources': ({ body }: any) => ({
        [MOCK_ACCOUNTS[0].address]: mockResourcesWithXRDValue('1000'),
        [MOCK_ACCOUNTS[1].address]: mockResourcesWithXRDValue('0'),
        [MOCK_ACCOUNTS[2].address]: mockResourcesWithXRDValue('1000'),
    })[JSON.parse(body).address as string],

    '/entity/overview': ({ body }: any) => mockEntityOverviewMetadata(JSON.parse(body).addresses as string[]),
})