<script lang="ts">
  import InfoBox from '@svelte-ui/components/info-box/InfoBox.svelte'
  import Row from '@svelte-ui/components/info-box/Row.svelte'
  import Success from '@svelte-ui/components/success/Success.svelte'
  import Text from '@svelte-ui/components/_base/text/Text.svelte'
  import { TransactionStatus } from '@common/utils/gateway-sdk'

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
