import Component from './Component.svelte'
import { mockGatewayCall } from '../../../../.storybook/test-utils'

export default {
  title: 'Search Pages/Component',
  component: Component,
  parameters: {
    mockData: [mockGatewayCall('/entity/details')]
  }
}

const Template = (args: any) => ({
  Component: Component,
  props: args
})

export const Primary = Template.bind(null, {
  address: 'rdx_0000000'
})
