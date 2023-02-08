<script lang="ts">
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import Success from '@components/success/Success.svelte'
  import Text from '@components/_base/text/Text.svelte'

  export let txID: string
</script>

<Success title="Transfer successful! 🎉">
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
    <Text align="left" color="link" underlined slot="value" let:entry>
      <a href="/transaction/{entry.value}">{entry.value}</a>
    </Text>
  </InfoBox>
</Success>
