<script lang="ts">
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import Row from '@components/info-box/Row.svelte'
  import Success from '@components/success/Success.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { TransactionStatus } from '@radixdlt/babylon-gateway-api-sdk'

  export let txID: string
  export let txStatus: TransactionStatus

  const txStatusTitle =
    txStatus === TransactionStatus.CommittedSuccess
      ? 'Transfer successful! 🎉'
      : 'Transfer failed or rejected ❌'
</script>

<Success title={txStatusTitle}>
  <InfoBox>
    <Row>
      <Text slot="left" bold align="right">Tx ID</Text>
      <Text slot="right" color="link" underlined>
        <a href="/transaction/{txID}">{txID}</a>
      </Text>
    </Row>
  </InfoBox>
</Success>
