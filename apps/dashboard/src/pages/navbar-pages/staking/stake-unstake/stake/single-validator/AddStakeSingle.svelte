<script lang="ts">
  import StakePanel from '../../StakePanel.svelte'
  import OverviewStakeCardSingle from '../../stake-card/OverviewStakeCardSingle.svelte'
  import AccountSection from '../../AccountSection.svelte'
  import { xrdAddress, type Account } from '@stores'
  import { getXRDBalance } from '../getXrdBalance'
  import { getStakeManifest } from '../../manifests'
  import { track } from '@dashboard/routes/+layout.svelte'

  export let validator: {
    name?: string
    address: string
    stakeUnitResourceAddress: string
    currentlyStakingAmount: Promise<string>
  }

  let xrd: string

  xrdAddress.subscribe((xrdAddress) => {
    xrd = xrdAddress as string
  })

  let stakeAmount: string

  let stakeButtonDisabled = true

  let selectedAccount: Account

  let xrdBalance: Promise<string> = new Promise(() => {})

  $: if (selectedAccount) {
    xrdBalance = getXRDBalance(selectedAccount.address)
  }
</script>

<StakePanel
  learnMoreUrl="https://learn.radixdlt.com/article/how-should-i-choose-validators-to-stake-to"
  bind:stakeButtonDisabled
  sidePanelHeader="Add Stake"
  on:click={(e) => {
    track('click:send-tx-stake')
    const manifest = getStakeManifest(
      selectedAccount.address,
      validator.address,
      validator.stakeUnitResourceAddress,
      stakeAmount,
      xrd
    )

    e.detail(manifest)
  }}
  on:close
>
  <svelte:fragment slot="account-picker">
    <AccountSection bind:selectedAccount />
  </svelte:fragment>

  <svelte:fragment slot="heading-text">Validator to stake to:</svelte:fragment>

  <svelte:fragment slot="content">
    <OverviewStakeCardSingle
      {validator}
      {xrdBalance}
      bind:stakeAmount
      bind:tokenAmountInvalid={stakeButtonDisabled}
    />
  </svelte:fragment>

  <svelte:fragment slot="info-box-title">How Staking Works</svelte:fragment>

  <svelte:fragment slot="info-box-explanation">
    Stake XRD to validators that you trust to reliably validate transactions on
    the Radix Network. If they maintain their performance, you can share in the
    XRD emissions rewards that result.
  </svelte:fragment>
</StakePanel>
