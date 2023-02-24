import Component from './Component.svelte'
import { fakeGatewayCall } from '../../../../.storybook/utils'

export default {
  title: 'Search Pages/Component',
  component: Component,
  parameters: {
    mockData: [fakeGatewayCall('/entity/details')]
  }
}

const Template = (args: any) => ({
  Component: Component,
  props: args
})

export const Primary = Template.bind(null, {
  address: 'rdx_0000000'
})
