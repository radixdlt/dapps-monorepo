<script lang="ts">
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import Validators from './Validators.svelte'

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
</script>

<Meta title="Navbar Pages / Validators" />

<Story name="Primary">
  <Validators validators={Promise.resolve(validators)} />
</Story>

<Story name="Loading">
  <Validators validators={new Promise(() => {})} />
</Story>
