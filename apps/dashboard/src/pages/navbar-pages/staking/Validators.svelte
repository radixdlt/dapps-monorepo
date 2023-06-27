<script lang="ts" context="module">
  export type Validator = {
    name: string
    address: string
    ownerAddress: string
    totalStake: number
    ownerStake: number
    percentageOwnerStake: number
    apy: number
    fee: number
    uptime: number
    acceptsStake: boolean
    website: string
    percentageTotalStake: number
    stakeUnitResourceAddress: string
    unstakeClaimResourceAddress: string
  }
  import InfoIcon from '@icons/info.svg'

  export type AccountWithStakes = Account & {
    stakes: {
      validator: string
      staked: number
      unstaking: number
      readyToClaim: number
    }[]
  }

  export const context = useContext<{
    connected: Writable<boolean>
    validators: Writable<Validator[]>
    bookmarkedValidators: Writable<Record<string, boolean>>
  }>()

  export const selectedValidators = writable<Record<string, boolean>>({})
  export const accountsWithStakes = writable<AccountWithStakes[]>([])
</script>

<script lang="ts">
  import ValidatorList from './validator-list/ValidatorList.svelte'
  import Icon from '@components/_base/icon/IconNew.svelte'
  import StakingCard from './staking-card/StakingCard.svelte'
  import { connected, type Account } from '@stores'
  import { useContext } from '@utils'
  import { writable, type Readable, type Writable } from 'svelte/store'
  import SelectedValidators from './selected-validators/SelectedValidators.svelte'
  import FilterButton from './filter-button/FilterButton.svelte'
  import FilterDetails from './filter-details/FilterDetails.svelte'
  import { goto } from '$app/navigation'
  import AddStakeMultiple from './stake-unstake/stake/multiple-validators/AddStakeMultiple.svelte'
  import { bookmarkedValidatorsStore } from '../../../stores'
  import type { StakeInfo } from '../../../routes/(navbar-pages)/validators/+layout.svelte'
  import BigNumber from 'bignumber.js'

  export let bookmarked: Promise<string[]>
  export let validators: Promise<Validator[]>
  export let stakeInfo: Readable<
    Promise<{
      stakes: StakeInfo[]
      unstaking: StakeInfo[]
      readyToClaim: StakeInfo[]
    }>
  >

  context.set('validators', writable([]))
  context.set('bookmarkedValidators', bookmarkedValidatorsStore)

  $: validators.then(context.get('validators').set)
  $: bookmarked
    .then((bookmarked) =>
      bookmarked.reduce((prev, curr) => ({ ...prev, [curr]: true }), {})
    )
    .then(context.get('bookmarkedValidators').set)

  let bookmarkedValidators = context.get('bookmarkedValidators')

  let resolvedValidators = context.get('validators')

  const getTotal =
    (type: 'stakes' | 'unstaking' | 'readyToClaim') =>
    (info: {
      stakes: StakeInfo[]
      unstaking: StakeInfo[]
      readyToClaim: StakeInfo[]
    }) =>
      info[type]
        .reduce(
          (prev, cur) => prev.plus(new BigNumber(cur.amount)),
          new BigNumber(0)
        )
        .toString()

  let totalStaked = new Promise<string>(() => {})

  $: totalStaked = $stakeInfo.then(getTotal('stakes'))

  let totalUnstaking = new Promise<string>(() => {})
  $: totalUnstaking = $stakeInfo.then(getTotal('unstaking'))

  let totalReadyToClaim = new Promise<string>(() => {})
  $: totalReadyToClaim = $stakeInfo.then(getTotal('readyToClaim'))

  let loading = true

  validators.then(() => {
    loading = false
  })

  let showFilterDetails = false
  let showAddMultipleStake = false

  $: filteredValidators = $resolvedValidators
</script>

<FilterDetails
  bind:open={showFilterDetails}
  feeValues={$resolvedValidators.map((v) => v.fee)}
  totalXRDStakeValues={$resolvedValidators.map((v) => v.percentageTotalStake)}
  ownerStakeValues={$resolvedValidators.map((v) => v.percentageOwnerStake)}
  on:applyFilter={(e) => {
    filteredValidators = $resolvedValidators.filter((v) => {
      return (
        v.fee >= e.detail.feeFilter.min &&
        v.fee <= e.detail.feeFilter.max &&
        v.percentageTotalStake >= e.detail.totalXRDStakeFilter.min &&
        v.percentageTotalStake <= e.detail.totalXRDStakeFilter.max &&
        v.percentageOwnerStake >= e.detail.ownerStakeFilter.min &&
        v.percentageOwnerStake <= e.detail.ownerStakeFilter.max &&
        (e.detail.acceptsStakeFilter ? v.acceptsStake : true) &&
        (e.detail.bookmarkedFilter ? $bookmarkedValidators[v.address] : true)
      )
    })
  }}
/>

<AddStakeMultiple
  bind:open={showAddMultipleStake}
  validators={$resolvedValidators.filter((v) => $selectedValidators[v.address])}
/>

<div id="validators">
  <div class="header">
    <div>
      <h1>Validators</h1>
      <p id="description" class="divider">
        View all your staked validators and list of validators available on the
        Radix Network
      </p>
    </div>
    <div id="selected-validators">
      {#if $connected}
        <SelectedValidators on:click={() => (showAddMultipleStake = true)} />
      {/if}
    </div>
  </div>

  <div class="divider">
    <div id="staked-validators" class="header-section">
      <h2 class="title">Your Staked Validators</h2>
      {#await $stakeInfo}
        <div class="subtext">
          Connect your wallet and your accounts containing Radix Network stake
          pool units to see the status of your current validators and stakes.
        </div>
        <div class="info-text">
          <Icon size="medium" icon={InfoIcon} />
          What is staking?
        </div>
      {:then}
        <div class="subtext">
          Summary of your stakes for your currently connected accounts.
        </div>
      {/await}
    </div>
    {#await $stakeInfo then stakes}
      <div id="staking-info">
        <StakingCard
          staking={totalStaked}
          unstaking={totalUnstaking}
          readyToClaim={totalReadyToClaim}
          claimText="Claim All"
        />
        <ValidatorList
          type="staked"
          items={$resolvedValidators.filter(
            (v) =>
              stakes.stakes.some((s) => s.validator.address === v.address) ||
              stakes.unstaking.some((s) => s.validator.address === v.address) ||
              stakes.readyToClaim.some((s) => s.validator.address === v.address)
          )}
          {loading}
          on:click-validator={(e) => {
            goto(`/validators/${e.detail}`)
          }}
        />
      </div>
    {/await}
  </div>

  <div class="header-section">
    <h2 class="title">All Validators</h2>
    <div class="subtext">List of validators available on the Radix Network</div>
    <div id="filter-btn">
      <FilterButton on:click={() => (showFilterDetails = true)} />
    </div>
  </div>

  <div>
    <ValidatorList
      type="all"
      items={filteredValidators}
      {loading}
      on:click-validator={(e) => {
        goto(`/validators/${e.detail}`)
      }}
    />
  </div>
</div>

<style lang="scss">
  @use '../../../../../../packages/ui/src/mixins.scss';
  #validators {
    display: grid;
    padding: var(--spacing-xl);
    gap: var(--spacing-2xl);
  }

  .header {
    display: flex;
  }

  #description {
    font-weight: var(--font-weight-bold-2);
  }

  #selected-validators {
    margin-left: auto;
  }

  #staked-validators {
    max-width: 90rem;
  }

  #staking-info {
    padding-top: var(--spacing-xl);
    display: grid;
    gap: var(--spacing-2xl);
  }

  .info-text {
    display: flex;
    align-items: center;
    font-size: var(--text-sm);
    color: var(--theme-button-primary);
    gap: var(--spacing-md);
    cursor: pointer;
  }

  .divider {
    border-bottom: var(--border) var(--theme-border);
    padding-bottom: var(--spacing-2xl);
  }

  .header-section {
    display: flex;
    align-items: center;
    gap: var(--spacing-xl);

    .title {
      margin: 0;
    }

    #filter-btn {
      margin-left: auto;
    }
  }
</style>
