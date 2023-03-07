import { mockGatewayCall } from './test-utils'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },
  mockAddonConfigs: {
    globalMockData: [mockGatewayCall('/entity/resources'), mockGatewayCall('/entity/overview'), mockGatewayCall('/entity/non-fungible/ids')]
  }
}
