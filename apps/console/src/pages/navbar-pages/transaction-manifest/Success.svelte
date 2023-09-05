<script lang="ts">
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import Row from '@components/info-box/Row.svelte'
  import Success from '@components/success/Success.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { RadixNetworkConfigById } from '@radixdlt/babylon-gateway-api-sdk'
  import { CURRENT_NETWORK } from '@networks'

  export let txID: string
  const dashboardUrl = RadixNetworkConfigById[CURRENT_NETWORK.id].dashboardUrl
</script>

<Success title="Your transaction was submitted! 🎉">
  <InfoBox>
    <Row>
      <Text align="right" bold slot="left">Tx ID</Text>
      <Text align="left" color="link" underlined slot="right">
        <a target="_blank" href={`${dashboardUrl}/transaction/${txID}`}
          >{txID}</a
        >
      </Text>
    </Row>
  </InfoBox>
</Success>
