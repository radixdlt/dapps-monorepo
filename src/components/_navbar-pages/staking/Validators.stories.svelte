<script lang="ts">
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import Validators from './Validators.svelte'
  import { accountLabel } from '@utils'

  const validators = Array(10)
    .fill(undefined)
    .map(() => ({
      name: 'RADNODE🔥',
      address: '0x1234567890',
      totalStake: Math.random() * 1000000,
      percentageOwnerStake: Math.random() * 30,
      apy: Math.random() * 10,
      fee: Math.random() * 0.1,
      uptime: Math.random() * 0.9,
      acceptsStake: Math.random() > 0.5 ? true : false,
      percentageTotalStake: Math.random() * 50
    }))

  const accounts = Array(10)
    .fill(undefined)
    .map(() => ({
      address: '0x1234567890',
      label: 'Account',
      displayed: accountLabel({
        address: '0x1234567890',
        label: 'Account'
      }),
      stakes: Array(10)
        .fill(undefined)
        .map(() => ({
          validator: '0x1234567890',
          staked: Math.random() * 1000000,
          unstaking: Math.random() * 1000000,
          readyToClaim: Math.random() * 1000000
        }))
    }))
</script>

<Meta title="Navbar Pages / Validators" />

<Story name="Not Connected">
  <Validators validators={Promise.resolve(validators)} />
</Story>

<Story name="Not Connected / Loading">
  <Validators validators={new Promise(() => {})} />
</Story>

<Story name="Connected">
  <Validators
    validators={Promise.resolve(validators)}
    accounts={Promise.resolve(accounts)}
  />
</Story>
