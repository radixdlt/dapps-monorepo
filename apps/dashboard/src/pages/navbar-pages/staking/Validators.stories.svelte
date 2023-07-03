<script lang="ts">
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import Validators from './Validators.svelte'
  import { accountLabel } from '@utils'
  import { writable, type Readable } from 'svelte/store'
  import type { StakeInfo } from '../../../routes/(navbar-pages)/validators/+layout.svelte'

  const validatorAddresses = [
    'validator_1234567890',
    'validator_1234567891',
    'validator_1234567892',
    'validator_1234567893',
    'validator_1234567894',
    'validator_1234567895',
    'validator_1234567896',
    'validator_1234567897',
    'validator_1234567898',
    'validator_1234567899'
  ]

  const validators = Array(50)
    .fill(undefined)
    .map((_, i) => ({
      name: 'RADNODE🔥',
      address: validatorAddresses[i % 10],
      totalStake: '100000000',
      percentageOwnerStake: Math.random() * 30,
      apy: Math.random() * 10,
      fee: Math.random() * 5,
      uptime: Math.random() * 0.9,
      acceptsStake: Math.random() > 0.5 ? true : false,
      percentageTotalStake: Math.random() * 50,
      website: 'https://radnode.io',
      ownerAddress: 'account_1234567890',
      ownerStake: '23000',
      bookmarked: false,
      selected: false,
      stakeUnitResourceAddress: 'resource_1234567890',
      unstakeClaimResourceAddress: 'resource_1234567890'
    }))

  const accounts = Array(3)
    .fill(undefined)
    .map(() => ({
      address: 'account_1234567890',
      label: 'Account',
      displayed: accountLabel({
        address: 'account_1234567890',
        label: 'Account'
      }),
      stakes: Array(3)
        .fill(undefined)
        .map((_) => ({
          validator: validatorAddresses[Math.floor(Math.random() * 9)],
          staked: Math.random() * 1000000,
          unstaking: Math.random() * 1000000,
          readyToClaim: Math.random() * 1000000
        }))
    }))

  const stakeInfo: Readable<
    Promise<{
      stakes: StakeInfo[]
      unstaking: StakeInfo[]
      readyToClaim: StakeInfo[]
    }>
  > = writable(
    Promise.resolve({
      stakes: Array(3)
        .fill(undefined)
        .map((_) => ({
          validator: validators[Math.floor(Math.random() * 9)],
          account: accounts[Math.floor(Math.random() * 2)],
          amount: '1000000'
        })),
      unstaking: Array(3)
        .fill(undefined)
        .map((_) => ({
          validator: validators[Math.floor(Math.random() * 9)],
          account: accounts[Math.floor(Math.random() * 2)],
          amount: '20000'
        })),
      readyToClaim: Array(3)
        .fill(undefined)
        .map((_) => ({
          validator: validators[Math.floor(Math.random() * 9)],
          account: accounts[Math.floor(Math.random() * 2)],
          amount: '30000'
        }))
    })
  )
</script>

<Meta title="Navbar Pages / Validators" />

<Story name="Connected">
  <Validators validators={Promise.resolve(validators)} {stakeInfo} />
</Story>
