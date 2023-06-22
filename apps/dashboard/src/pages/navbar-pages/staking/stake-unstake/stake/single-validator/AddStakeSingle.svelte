<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import StakeUnstakePanel from '../../StakePanel.svelte'
  import OverviewStakeCardSingle from '../../stake-card/OverviewStakeCardSingle.svelte'
  import type ValidatorInfo from '../../stake-card/ValidatorInfo.svelte'
  import AccountSection from '../../AccountSection.svelte'
  import type { Account } from '@stores'
  import { getAccountData } from '@api/utils/resources'
  import { CURRENT_NETWORK } from '@networks'
  import { sendTransaction } from '@api/wallet'

  export let open: boolean
  export let validatorInfo: ComponentProps<ValidatorInfo>

  const getStakeManifest = (
    accountAddress: string,
    validatorAddress: string,
    amount: string
  ) => `
    CALL_METHOD
      Address("${accountAddress}")
      "withdraw"
      Address("${CURRENT_NETWORK.xrdAddress}")
      Decimal("${amount}");

    TAKE_ALL_FROM_WORKTOP
      Address("${CURRENT_NETWORK.xrdAddress}")
      Bucket("bucket1");

    CALL_METHOD
      Address("${validatorAddress}")
      "stake"
      Bucket("bucket1");

    CALL_METHOD
      Address("${accountAddress}")
      "try_deposit_batch_or_abort"
      Expression("ENTIRE_WORKTOP");
  `

  let stakeAmount: string

  let stakeButtonDisabled = true

  let selectedAccount: Account

  let xrdBalance: Promise<string> = new Promise(() => {})

  $: if (selectedAccount) {
    xrdBalance = getAccountData([selectedAccount.address]).then(
      (data) =>
        data[0].fungible
          .find((f) => f.address === CURRENT_NETWORK.xrdAddress)
          ?.value.toString() ?? '0'
    )
  }

  const stake = () => {
    const manifest = getStakeManifest(
      selectedAccount.address,
      validatorInfo.address,
      stakeAmount
    )

    sendTransaction(manifest)
  }
</script>

<StakeUnstakePanel bind:open bind:stakeButtonDisabled on:click={stake}>
  <svelte:fragment slot="title">Add Stake</svelte:fragment>

  <svelte:fragment slot="account-picker" let:rightColumnWidth>
    <AccountSection bind:selectedAccount --width={rightColumnWidth}>
      <svelte:fragment slot="account-picker-text">
        <h4>Stake amount coming from</h4>
      </svelte:fragment>
    </AccountSection>
  </svelte:fragment>

  <svelte:fragment slot="heading-text">
    Validator you have chosen to stake to
  </svelte:fragment>

  <svelte:fragment slot="heading-subtext">Total staking amount</svelte:fragment>

  <svelte:fragment slot="content" let:rightColumnWidth>
    <OverviewStakeCardSingle
      {validatorInfo}
      {xrdBalance}
      bind:stakeAmount
      bind:tokenAmountInvalid={stakeButtonDisabled}
      --token-amount-card-width={rightColumnWidth}
    />
  </svelte:fragment>

  <svelte:fragment slot="info-box-title">How Staking Works</svelte:fragment>

  <svelte:fragment slot="info-box-explanation">
    Explanation of how staking works
  </svelte:fragment>

  <svelte:fragment slot="button-text">Stake</svelte:fragment>
</StakeUnstakePanel>
