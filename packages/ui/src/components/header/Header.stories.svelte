<script lang="ts">
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import Header from './Header.svelte'
  import { RadixDappToolkit } from '@radixdlt/radix-dapp-toolkit'
  RadixDappToolkit({ dAppDefinitionAddress: '', networkId: 12 })
</script>

<Meta title="Header" />

<Story name="Primary">
  <Header
    on:click={() => {
      console.log('menu icon click')
    }}
  />
</Story>
