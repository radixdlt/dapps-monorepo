<script lang="ts">
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import Row from '@components/info-box/Row.svelte'
  import Success from '@components/success/Success.svelte'
  import Text from '@components/_base/text/Text.svelte'

  export let txID: string
</script>

<Success title="Your transaction was submitted! 🎉">
  <InfoBox>
    <Row>
      <Text align="right" bold slot="left">Tx ID</Text>
      <Text align="left" color="link" underlined slot="right">
        <a href="/transaction/{txID}">{txID}</a>
      </Text>
    </Row>
  </InfoBox>
</Success>
