import { mockGatewayCall, MOCK_ACCOUNTS, MOCK_WEBSITES } from './test-utils'
import ThemeDecorator from './ThemeDecorator.svelte'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },
  mockAddonConfigs: {
    globalMockData: [
      mockGatewayCall('/state/non-fungible/ids'),
      mockGatewayCall('/state/entity/details'),
      {
        url: MOCK_WEBSITES[0] + '/.well-known/radix.json',
        method: 'GET',
        status: 200,
        response: {
          dapp_definition: MOCK_ACCOUNTS[2].address
        }
      }
    ]
  },
  viewport: {
    viewports: {
      '14" laptop': {
        name: '14" laptop',
        styles: {
          width: '1600px',
          height: '900px',
        }
      },
    },
  }
}

export const decorators = [() => ThemeDecorator]