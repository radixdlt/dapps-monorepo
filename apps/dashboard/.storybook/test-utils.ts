import mocks from '@api/mocks.json'
import { XRD_NAME } from '@constants'
import { pipe } from 'ramda'
import { CURRENT_NETWORK } from '../src/network'

const XRD_ADDRESS =
    'resource_tdx_24_1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqxrd'

const MOCK_ENTITIES = [
    'resource_tdx_22_1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqj3nwpk',
    'package_tdx_22_1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqj3nwpk',
] as const

export const MOCK_WEBSITES = [
    'https://radixdlt.com',
    'https://otherwebsite.com',
] as const

const MOCK_TOKENS = [
    {
        address: XRD_ADDRESS,
        name: XRD_NAME
    },
    {
        address:
            'resource_tdx_24_1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqtest',
        name: 'TEST'
    },
    {
        address:
            'resource_tdx_24_1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqfloop',
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
        label: 'dapp definition (acco...qpjxr6)',
        address: 'account_tdx_22_1prtqhxd5mmq2nj3mrhcztxphauy29qeuk5walu49spjsqpjxr6'
    }
] as const

export const mockGatewayCall = (endpoint: keyof typeof mocks) => ({
    url: `${CURRENT_NETWORK.url}${endpoint}`,
    method: 'POST',
    status: 200,
    response: responses[endpoint] ?? mocks[endpoint]
})

const copyJSON = <T>(json: T): T => JSON.parse(JSON.stringify(json))

const mockResourcesWithXRDValue = (value: string) => (mock: typeof mocks['/state/entity/details']) => {
    const _mock = copyJSON(mock)
    // @ts-ignore
    _mock.items[0]!.fungible_resources.items = MOCK_TOKENS.map((token) => ({
        aggregation_level: 'Vault',
        resource_address: token.address,
        vaults: {
            items: [
                {
                    amount: token.address === XRD_ADDRESS ? value : '100'
                }
            ]
        }
    }))
    return _mock
}

const mockNonFungibleResources = (mock: typeof mocks['/state/entity/details']) => {
    const _mock = copyJSON(mock)
    // @ts-ignore
    _mock.items[0]!.non_fungible_resources.items = MOCK_ENTITIES.map((entity) => ({
        aggregation_level: 'Vault',
        resource_address: entity,
        vaults: {
            items: [
                {
                    amount: '1'
                }
            ]
        }
    }))
    return _mock
}

const mockDappDefinitionMetadata = (mock: typeof mocks['/state/entity/details']) => {
    const _mock = copyJSON(mock)
    _mock.items[0]!.metadata.items[0]!.key = 'account_type'
    _mock.items[0]!.metadata.items[0]!.value.as_string = 'dapp_definition'
    return _mock
}

const mockEntityDetailsForAccount = (address: typeof MOCK_ACCOUNTS['0' | '1' | '2']['address']) => ({
    [MOCK_ACCOUNTS[0].address]: pipe(
        mockResourcesWithXRDValue('1000'),
        mockNonFungibleResources,
    ),
    [MOCK_ACCOUNTS[1].address]: pipe(
        mockResourcesWithXRDValue('0'),
        mockNonFungibleResources,
    ),
    [MOCK_ACCOUNTS[2].address]: pipe(
        mockResourcesWithXRDValue('1000'),
        mockNonFungibleResources,
        mockDappDefinitionMetadata
    )
})[address](mocks['/state/entity/details'])

// @ts-ignore
const responses: Record<keyof typeof mocks, any> = {
    '/state/entity/details': ({ body }: any) => {
        const parsed = JSON.parse(body)
        if (parsed.addresses.length === 1) {
            return mockEntityDetailsForAccount(parsed.addresses[0])
        }

        return {
            items: MOCK_TOKENS.map((token) => ({
                address: token.address,
                metadata: {
                    items: [{ key: 'name', value: { as_string: token.name } }]
                }
            }))
        }

    },


}


