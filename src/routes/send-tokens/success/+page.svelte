<script lang="ts">
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<center>
  <Text bold size="xlarge">Transfer successful! 🎉</Text>
  <Box cx={{ width: '900px' }}>
    <InfoBox
      entries={[
        {
          key: 'Tx ID',
          value: data.txID
        }
      ]}
      loading={false}
      transparent
    >
      <Text align="right" bold slot="key" let:entry>
        {entry.key}
      </Text>
      <Text align="left" color="link" underlined slot="value" let:entry>
        <a href="/transaction/{entry.value}">{entry.value}</a>
      </Text>
    </InfoBox>
  </Box>
</center>
