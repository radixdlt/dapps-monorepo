<script lang="ts">
  import InfoBox from '@svelte-ui/components/info-box/InfoBox.svelte'
  import Row from '@svelte-ui/components/info-box/Row.svelte'
  import Success from '@svelte-ui/components/success/Success.svelte'
  import Text from '@svelte-ui/components/_base/text/Text.svelte'
  import { RadixNetworkConfigById } from '@common/utils/gateway-sdk'
  import { CURRENT_NETWORK } from '../../../network'

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
