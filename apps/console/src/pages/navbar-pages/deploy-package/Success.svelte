<script lang="ts">
  import {
    TransactionStatus,
    RadixNetworkConfigById
  } from '@common/gateway-sdk'
  import { CURRENT_NETWORK } from '@networks'

  export let txID: string
  export let txStatus: TransactionStatus
  export let packageAddress: string

  const txStatusTitle =
    txStatus === TransactionStatus.CommittedSuccess
      ? 'Your package was submitted! 🎉'
      : 'Your package was not submitted! ❌'

  const dashboardUrl = RadixNetworkConfigById[CURRENT_NETWORK.id].dashboardUrl
</script>

<div class="content">
  <h1>{txStatusTitle}</h1>
  <div class="item">
    <strong>Transaction ID:</strong>
    <a target="_blank" href={`${dashboardUrl}/transaction/${txID}`}>{txID}</a>
  </div>
  <div class="item">
    <strong>Package address:</strong>
    <a target="_blank" href={`${dashboardUrl}/package/${packageAddress}`}
      >{packageAddress}</a
    >
  </div>
</div>

<style lang="scss">
  .content {
    text-align: center;
  }
  h1 {
    margin-bottom: 2rem;
  }
  .item {
    margin-bottom: 1rem;
  }
</style>
