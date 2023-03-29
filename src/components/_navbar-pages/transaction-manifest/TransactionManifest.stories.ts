import { userEvent, within } from '@storybook/testing-library'
import TransactionManifest from './TransactionManifest.svelte'

export default {
  title: 'Navbar Pages/Transaction manifest',
  component: TransactionManifest
}

const Template = (args: any) => ({
  Component: TransactionManifest,
  props: args
})

export const Empty = Template.bind(null, {})

// @ts-ignore
Empty.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const { findByText, findByPlaceholderText } = canvas
  await findByPlaceholderText('Enter a raw transaction manifest')
  await findByText('Send')
}

export const WithLockFee = Template.bind(null, {})
// @ts-ignore
WithLockFee.play = async ({ canvasElement }) => {
  const txManifest = `CALL_METHOD ComponentAddress("account_tdx_b_1pqdy2mvxrkyycaj0c8c2g8xekf3me27f3hvl9q52cqcs7x2w96") "lock_fee" Decimal("10");`
  const canvas = within(canvasElement)
  const { findByText, findByPlaceholderText } = canvas
  const txManifestTextarea: HTMLTextAreaElement = await findByPlaceholderText(
    'Enter a raw transaction manifest'
  )
  userEvent.click(txManifestTextarea)
  userEvent.type(txManifestTextarea, txManifest)

  const sendButton: HTMLButtonElement = await findByText('Send')
  sendButton.click()

  // Confirm dialog is injected outside of the component
  const body = within(document.body)
  await body.findByText('Cancel')
  await body.findByText('Continue')
}

export const Sending = Template.bind(null, {})
// @ts-ignore
Sending.play = async ({ canvasElement }) => {
  const txManifest = `CALL_METHOD ComponentAddress("account_tdx_b_1pqdy2mvxrkyycaj0c8c2g8xekf3me27f3hvl9q52cqcs7x2w96") Decimal("10");`
  const canvas = within(canvasElement)
  const { findByText, findByPlaceholderText } = canvas
  const txManifestTextarea: HTMLTextAreaElement = await findByPlaceholderText(
    'Enter a raw transaction manifest'
  )
  userEvent.click(txManifestTextarea)
  userEvent.type(txManifestTextarea, txManifest)

  const sendButton: HTMLButtonElement = await findByText('Send')
  sendButton.click()
}
