<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import StakeUnstakePanel from '../../StakePanel.svelte'
  import OverviewStakeCardSingle from '../../stake-card/OverviewStakeCardSingle.svelte'
  import type ValidatorInfo from '../../stake-card/ValidatorInfo.svelte'
  import AccountSection from '../../AccountSection.svelte'
  import type { Account } from '@stores'
  import { sendTransaction } from '@api/wallet'
  import { getXRDBalance } from '../getXrdBalance'
  import { getStakeManifest } from '../../manifests'

  export let open: boolean
  export let validator: ComponentProps<ValidatorInfo>
  export let token: ComponentProps<OverviewStakeCardSingle>['token']

  let stakeAmount: string

  let stakeButtonDisabled = true

  let selectedAccount: Account

  let xrdBalance: Promise<string> = new Promise(() => {})

  $: if (selectedAccount) {
    xrdBalance = getXRDBalance(selectedAccount.address)
  }

  const stake = () => {
    const manifest = getStakeManifest(
      selectedAccount.address,
      validator.address,
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
      {token}
      {validator}
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
