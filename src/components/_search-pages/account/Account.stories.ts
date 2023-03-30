import { within } from '@storybook/testing-library'
import Account from './Account.svelte'

const metadata = {
  items: [
    {
      key: 'name',
      value: {
        as_string: 'Test'
      }
    },
    {
      key: 'description',
      value: {
        as_string: `this is a description
        with multiple lines`
      }
    },
    {
      key: 'other',
      value: {
        as_string: 'other value'
      }
    },
    {
      key: 'claimed_entities',
      value: {
        as_string_collection: [
          'account_tdx_c_1pxqng3rlph0xkau3rf79gyxhzyy9tesxr7znj3jjyqgqjpc4xd',
          'account_tdx_c_1pxqng3rlph0xkau3rf79gyxhzyy9tesxr7znj3jjyqgqjpc422',
          'account_tdx_c_1pxqng3rlph0xkau3rf79gyxhzyy9tesxsadnj3jjyqgqjpc4xd'
        ]
      }
    }
  ]
}

export default {
  title: 'Search Pages/Account',
  component: Account
}

const Template = (args: any) => ({
  Component: Account,
  props: {
    address: 'rdx_000000',
    ...args
  }
})

export const WithoutResources = Template.bind(null, {
  details: Promise.resolve({
    item: { metadata: { items: [] } },
    fungible: [],
    nonFungible: []
  })
})

export const WithResources = Template.bind(null, {
  details: Promise.resolve({
    item: { metadata },
    fungible: [
      {
        address: 'rdx_10000000000',
        label: 'XRD',
        value: '100'
      },
      {
        address: 'rdx_10000000000',
        label: 'BTC',
        value: '190000000'
      }
    ],
    nonFungible: [
      {
        address: 'rdx_10000000000',
        label: 'FLOOP (Test) 0x0000000:#1#'
      },
      {
        address: 'rdx_10000000000',
        label: 'SMARF (Test) 0x0000000:#1#'
      },
      {
        address: 'rdx_10000000000',
        label: 'PERP (Test) 0x0000000:#12#'
      }
    ]
  })
})

export const Loading = Template.bind(null, {
  details: new Promise(() => {})
})

// @ts-ignore
WithoutResources.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const { findByText } = canvas
  await findByText("This account doesn't hold any tokens or NFTs")
}

// @ts-ignore
WithResources.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const { findByText } = canvas
  await findByText('Tokens (fungible resources)')
  await findByText('NFTs (nonfungible resources)')
}
