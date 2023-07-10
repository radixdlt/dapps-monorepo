<script lang="ts" context="module">
  export type Validator = {
    name: string
    address: string
    ownerAddress: string
    totalStake: string
    ownerStake: string
    percentageOwnerStake: number
    apy: number
    fee: number
    uptime: number
    acceptsStake: boolean
    website: string
    percentageTotalStake: number
    stakeUnitResourceAddress: string
    unstakeClaimResourceAddress: string
    stakeUnitsToStakedRatio: BigNumber
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
  import { writable, type Writable } from 'svelte/store'
  import SelectedValidators from './selected-validators/SelectedValidators.svelte'
  import FilterButton from './filter-button/FilterButton.svelte'
  import { goto } from '$app/navigation'
  import {
    stakeInfo,
    type StakeInfo
  } from '../../../routes/(navbar-pages)/validators/+layout.svelte'
  import BigNumber from 'bignumber.js'
  import { createEventDispatcher } from 'svelte'

  export let validators: Promise<Validator[]>

  context.set('validators', writable([]))

  $: validators.then(context.get('validators').set)

  const getTotal =
    (type: 'staked' | 'unstaking' | 'readyToClaim') =>
    (info: {
      staked: StakeInfo[]
      unstaking: StakeInfo[]
      readyToClaim: StakeInfo[]
    }) =>
      info[type]
        .reduce(
          (prev, cur) => prev.plus(new BigNumber(cur.xrdAmount)),
          new BigNumber(0)
        )
        .toString()

  let totalStaked = new Promise<string>(() => {})

  $: totalStaked = $stakeInfo.then(getTotal('staked'))

  let totalUnstaking = new Promise<string>(() => {})
  $: totalUnstaking = $stakeInfo.then(getTotal('unstaking'))

  let totalReadyToClaim = new Promise<string>(() => {})
  $: totalReadyToClaim = $stakeInfo.then(getTotal('readyToClaim'))

  const dispatch = createEventDispatcher<{
    'show-claim-all': undefined
    'show-stake-multiple': undefined
    'show-filters': undefined
  }>()
</script>

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
        <SelectedValidators
          on:click={() => {
            dispatch('show-stake-multiple')
          }}
        />
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
          <Icon icon={InfoIcon} />
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
          on:click={() => {
            dispatch('show-claim-all')
          }}
        />
        <ValidatorList
          type="staked"
          validators={validators.then((v) =>
            v.filter(
              (v) =>
                stakes.staked.some((s) => s.validator.address === v.address) ||
                stakes.unstaking.some(
                  (s) => s.validator.address === v.address
                ) ||
                stakes.readyToClaim.some(
                  (s) => s.validator.address === v.address
                )
            )
          )}
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
      <FilterButton
        on:click={() => {
          dispatch('show-filters')
        }}
      />
    </div>
  </div>

  <div>
    <ValidatorList
      type="all"
      {validators}
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
