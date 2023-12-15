<script lang="ts">
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import Summary from './Summary.svelte'
  import type { ComponentProps } from 'svelte'

  const timestamp = Promise.resolve(new Date())
  const status = Promise.resolve('CommittedSuccess' as const)
  const message = Promise.resolve(
    'This transaction represents not just a transfer of cryptocurrency, but also a transfer of gratitude and recognition for your exceptional contributions.'
  )
  const balanceChanges: ComponentProps<Summary>['balanceChanges'] =
    Promise.resolve([
      {
        account: '0x000000',
        balanceChanges: [
          {
            type: 'fungible',
            token: {
              address: '0x000000',
              icon: 'https://picsum.photos/200/200',
              name: 'TEST'
            },
            change: '100'
          },
          {
            type: 'non-fungible',
            token: {
              address: '0x000000',
              id: '0x000000',
              icon: 'https://picsum.photos/200/200',
              name: 'Cool Monkey',
              resourceName: 'Bored Apes'
            },
            change: 'added'
          },
          {
            type: 'fungible',
            token: {
              address: '0x000000',
              icon: 'https://picsum.photos/200/200',
              name: 'XRD'
            },
            change: '-200'
          },
          {
            type: 'fee',
            token: {
              address: '0x000000',
              icon: 'https://picsum.photos/200/200',
              name: 'Radix (XRD)'
            },
            change: '10'
          }
        ]
      },
      {
        account: '0x000001',
        balanceChanges: [
          {
            type: 'fungible',
            token: {
              address: '0x000000',
              icon: 'https://picsum.photos/200/200',
              name: 'TEST'
            },
            change: '100'
          },
          {
            type: 'fungible',
            token: {
              address: '0x000000',
              icon: 'https://picsum.photos/200/200',
              name: 'Radix (XRD)'
            },
            change: '-200'
          },
          {
            type: 'non-fungible',
            token: {
              address: '0x000000',
              id: '0x000000',
              icon: 'https://picsum.photos/200/200',
              name: 'Space Monkey',
              resourceName: 'Bored Apes'
            },
            change: 'removed'
          }
        ]
      }
    ])
</script>

<Meta title="Search Pages / Transaction / Summary" />

<Story name="primary">
  <Summary {timestamp} {status} {message} {balanceChanges} />
</Story>
