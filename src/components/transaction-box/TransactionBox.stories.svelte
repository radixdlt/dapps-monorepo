<script lang="ts">
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import TransactionBox from './TransactionBox.svelte'
</script>

<Meta title="TransactionBox" />

<Story name="Primary">
  <TransactionBox
    tx={new Promise((resolve) =>
      resolve({
        status: 'success',
        actions: [
          {
            from: '0x1234567890',
            to: '0x1234567890',
            amount: 100
          }
        ]
      })
    )}
  />
</Story>

<Story name="Loading">
  <TransactionBox tx={new Promise((_) => {})} />
</Story>
