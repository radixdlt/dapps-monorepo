<script lang="ts">
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import InfoBox from './InfoBox.svelte'

  const data = {
    status: 'success',
    from: '0x1234567890',
    to: '0x1234567890',
    amount: 100
  }
</script>

<Meta title="InfoBox" />

<Story name="Primary">
  <InfoBox {data} loading={false} />
</Story>

<Story name="Loading">
  <InfoBox {data} loading />
</Story>
