<script lang="ts">
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import TransactionBox from './TransactionBox.svelte'

  const tx = {
    status: 'success',
    actions: [
      {
        from: '0x1234567890',
        to: '0x1234567890',
        amount: 100
      }
    ]
  }
</script>

<Meta title="TransactionBox" />

<Story name="Primary">
  <TransactionBox {tx} loading={false} />
</Story>

<Story name="Loading">
  <TransactionBox {tx} loading />
</Story>
