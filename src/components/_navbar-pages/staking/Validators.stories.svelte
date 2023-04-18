<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import Validators from './Validators.svelte'

  const validators = Promise.resolve(
    Array(10).fill({
      name: 'RADNODE🔥',
      address: '0x1234567890',
      totalStake: 100000,
      percentageOwnerStake: 50,
      apy: 10,
      fee: 0.1,
      uptime: 0.9,
      acceptsStake: true,
      percentageTotalStake: 50
    })
  )
</script>

<Meta title="Navbar Pages / Validators" />

<Story name="Primary">
  <Validators {validators} />
</Story>

<Story name="Loading">
  <Validators validators={new Promise(() => {})} />
</Story>
