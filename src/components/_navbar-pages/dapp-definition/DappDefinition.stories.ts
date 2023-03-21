import { MOCK_ACCOUNTS } from '../../../../.storybook/test-utils'
import DappDefinition from './DappDefinition.svelte'

export default {
  title: 'Navbar Pages/Dapp Definition',
  component: DappDefinition
}

const Template = (args: any) => ({
  Component: DappDefinition,
  props: args
})

export const Primary = Template.bind(null, {
  accounts: MOCK_ACCOUNTS
})
