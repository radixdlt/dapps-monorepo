<script lang="ts">
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import InfoBox from './InfoBox.svelte'

  const keys = ['status', 'from', 'to', 'amount']
  const values = ['success', '0x1234567890', '0x1234567890', 100]
</script>

<Meta title="InfoBox" />

<Story name="Primary">
  <InfoBox {keys} {values} loading={false} />
</Story>

<Story name="Loading">
  <InfoBox {keys} {values} loading />
</Story>
