<script lang="ts">
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import Row from '@components/info-box/Row.svelte'
  import Success from '@components/success/Success.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { getNFTAddress } from '@utils'
  import {
    TransactionStatus,
    RadixNetworkConfigById
  } from '@radixdlt/babylon-gateway-api-sdk'
  import { CURRENT_NETWORK } from '@networks'

  export let txID: string
  export let txStatus: TransactionStatus
  export let packageAddress: string
  export let badgeInfo: {
    name?: string
    address: string
    id: string
  }

  const txStatusTitle =
    txStatus === TransactionStatus.CommittedSuccess
      ? 'Your package was submitted! 🎉'
      : 'Your package was not submitted! ❌'
  const NFTAddress = getNFTAddress(badgeInfo.address, badgeInfo.id)

  const dashboardUrl = RadixNetworkConfigById[CURRENT_NETWORK.id].dashboardUrl
</script>

<Success title={txStatusTitle}>
  <InfoBox>
    <Row>
      <Text slot="left" align="right" bold>Tx ID</Text>
      <Text slot="right" align="left">
        <Text color="link">
          <a target="_blank" href={`${dashboardUrl}/transaction/${txID}`}
            >{txID}</a
          >
        </Text>
      </Text>
    </Row>
    <Row>
      <Text slot="left" align="right" bold>Package address</Text>
      <Text slot="right" align="left">
        <Text color="link">
          <a target="_blank" href={`${dashboardUrl}/package/${packageAddress}`}
            >{packageAddress}</a
          >
        </Text>
      </Text>
    </Row>
    <Row>
      <Text slot="left" align="right" bold>Owner badge</Text>
      <Text slot="right" align="left">
        <Text color="link">
          <a
            target="_blank"
            href={`${dashboardUrl}/nft/${encodeURIComponent(
              `${badgeInfo.address}:${badgeInfo.id}`
            )}`}
          >
            {badgeInfo.name ? `${badgeInfo.name} (${NFTAddress})` : NFTAddress}
          </a>
        </Text>
      </Text>
    </Row>
  </InfoBox>
</Success>
