<script lang="ts">
  import {
    TransactionStatus,
    RadixNetworkConfigById
  } from '@common/gateway-sdk'
  import { CURRENT_NETWORK } from '@networks'

  export let txID: string
  export let txStatus: TransactionStatus
  export let resourceAddress: string

  const txStatusTitle =
    txStatus === TransactionStatus.CommittedSuccess
      ? 'Your resource was created! 🎉'
      : 'Your resource was not created! ❌'

  const dashboardUrl = RadixNetworkConfigById[CURRENT_NETWORK.id].dashboardUrl
</script>

<div class="content">
  <h1>{txStatusTitle}</h1>
  <div class="item">
    <strong>Transaction ID:</strong>
    <a target="_blank" href={`${dashboardUrl}/transaction/${txID}`}>{txID}</a>
  </div>
  <div class="item">
    <strong>Resource address:</strong>
    <a target="_blank" href={`${dashboardUrl}/resource/${resourceAddress}`}
      >{resourceAddress}</a
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
