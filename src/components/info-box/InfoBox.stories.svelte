<script lang="ts">
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import InfoBox from './InfoBox.svelte'
  import Text from '@components/_base/text/Text.svelte'

  const entries = [
    { key: 'status', value: 'success' },
    { key: 'from', value: '0x1234567890' },
    { key: 'to', value: '0x1234567890' },
    { key: 'amount', value: '100' }
  ]
</script>

<Meta title="InfoBox" />

<Story name="Primary">
  <InfoBox {entries} loading={false} />
</Story>

<Story name="Loading">
  <InfoBox {entries} loading />
</Story>

<Story name="Custom Content">
  <InfoBox {entries} loading={false}>
    <Text underlined slot="key" let:entry>
      {entry.key}
    </Text>
    <Text underlined slot="value" let:entry>
      {entry.value}
    </Text>
  </InfoBox>
</Story>
