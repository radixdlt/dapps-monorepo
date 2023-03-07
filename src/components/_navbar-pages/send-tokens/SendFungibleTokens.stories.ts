import { expect } from '@storybook/jest'
import { MOCK_ACCOUNTS } from '../../../../.storybook/test-utils'
import { within, userEvent } from '@storybook/testing-library'
import SendFungibleTokens from './SendFungibleTokens.svelte'
import mocks from '@api/mocks.json'

export default {
  title: 'Navbar Pages/Send Tokens',
  component: SendFungibleTokens
}

const Template = (args: any) => ({
  Component: SendFungibleTokens,
  props: args
})

export const Primary = Template.bind(null, {
  accounts: MOCK_ACCOUNTS
})

// @ts-ignore
Primary.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const { findByText, findByPlaceholderText } = canvas
  const targetAccount = await findByText('Select account')
  const amountInput = await findByPlaceholderText('Amount')
  const sendButton = await findByText('Send')

  userEvent.click(targetAccount)
  userEvent.click(await findByText('Secondary Account (acco...r2ccqa)'))

  userEvent.clear(amountInput)
  userEvent.type(amountInput, '9999999')

  await findByText('Not enough tokens in this account')
  expect(sendButton.hasAttribute('disabled')).toBe(true)

  userEvent.clear(amountInput)
  userEvent.type(amountInput, '100')

  await findByText(
    mocks['/entity/resources']['fungible_resources']['items'][0]?.amount
      .value as string
  )
  await findByText('(Available balance)')

  expect(sendButton.hasAttribute('disabled')).toBe(false)
}
