import { expect } from '@storybook/jest'
import { fakeGatewayCall } from '../../../../.storybook/utils'
import { within, userEvent } from '@storybook/testing-library'
import SendFungibleTokens from './SendFungibleTokens.svelte'

export default {
  title: 'Navbar Pages/Send Tokens',
  component: SendFungibleTokens,
  parameters: {
    mockData: [
      fakeGatewayCall('/entity/resources'),
      fakeGatewayCall('/entity/overview'),
      fakeGatewayCall('/entity/non-fungible/ids')
    ]
  }
}

const Template = (args: any) => ({
  Component: SendFungibleTokens,
  props: args
})

const accounts = [
  {
    label: 'Main Account (acco...7x2w96)',
    address: 'account_tdx_b_1pqdy2mvxrkyycaj0c8c2g8xekf3me27f3hvl9q52cqcs7x2w96'
  },
  {
    label: 'Secondary Account (acco...r2ccqa)',
    address: 'account_tdx_b_1pz92kpp5xrqhh09xff6xulwxkluspscqj0etre3tjc5sr2ccqa'
  }
]

export const WithAccounts = Template.bind(null, {
  accounts
})

export const WithoutAccounts = Template.bind(null, {
  accounts: []
})

// @ts-ignore
WithoutAccounts.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const { findByText } = canvas
  await findByText('No tokens found')
  await findByText('Select personal account')
}

// @ts-ignore
WithAccounts.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const { findByText, findByPlaceholderText } = canvas
  const targetAcount = await findByText('Select personal account')
  const amountInput = await findByPlaceholderText('Amount')
  const sendButton = await findByText('Send')

  userEvent.click(targetAcount)
  userEvent.click(await findByText('Secondary Account (acco...r2ccqa)'))

  userEvent.clear(amountInput)
  userEvent.type(amountInput, '9999999')

  findByText('Not enough tokens in this account')
  expect(sendButton.hasAttribute('disabled')).toBe(true)

  userEvent.clear(amountInput)
  userEvent.type(amountInput, '100')

  await findByText('10000')
  await findByText('(Available balance)')

  expect(sendButton.hasAttribute('disabled')).toBe(false)
}
