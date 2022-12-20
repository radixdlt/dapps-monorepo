<script lang="ts">
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Text from '@components/_base/text/Text.svelte'

  export let txID: string
</script>

<center>
  <Text bold size="xlarge">Transfer successful! 🎉</Text>
  <Box transparent>
    <InfoBox
      entries={[
        {
          key: 'Tx ID',
          value: txID
        }
      ]}
      loading={false}
      transparent
    >
      <Text align="right" bold slot="key" let:entry>
        {entry.key}
      </Text>
      <Text align="left" slot="value" let:entry>
        {entry.value}
      </Text>
    </InfoBox>
  </Box>
</center>
