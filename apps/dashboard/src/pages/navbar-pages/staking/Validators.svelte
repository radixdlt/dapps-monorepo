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
    metadata: EntityMetadataItem[]
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
  } from '../../../routes/(navbar-pages)/network-staking/+layout.svelte'
  import BigNumber from 'bignumber.js'
  import { createEventDispatcher } from 'svelte'
  import Divider from '@components/_base/divider/Divider.svelte'
  import type { EntityMetadataItem } from '@radixdlt/babylon-gateway-api-sdk'

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
    'show-claim-single': string
    'show-stake-multiple': undefined
    'show-filters': undefined
  }>()
</script>

<div id="validators">
  <div class="title-header">
    <div class="title">
      <h1>Radix Network Staking</h1>
      <p class="description">
        View all currently registered Radix Network validator nodes, and manage
        your own XRD stakes to validators.
      </p>
    </div>

    <div style:width="50rem" />
  </div>

  <div class="selected-validators">
    {#if $connected}
      <SelectedValidators
        on:click={() => {
          dispatch('show-stake-multiple')
        }}
      />
    {/if}
  </div>

  <Divider --spacing="var(--spacing-xl)" />

  <div>
    <div id="staked-validators" class="header-section">
      <h2 class="title">Your Stakes</h2>
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
          Summary of your current stakes and requested unstakes for the accounts
          you have connected.
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
            goto(`/network-staking/${e.detail}`)
          }}
          on:claim-validator={(e) => {
            dispatch('show-claim-single', e.detail)
          }}
        />
      </div>
    {/await}
  </div>

  <Divider --spacing="var(--spacing-xl)" />

  <div class="header-section">
    <h2 class="title">Validator Nodes</h2>
    <div class="subtext">
      Full list of validator nodes currently registered on the Radix Network.
    </div>
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
        goto(`/network-staking/${e.detail}`)
      }}
    />
  </div>
</div>

<style lang="scss">
  @use '../../../../../../packages/ui/src/mixins.scss';
  #validators {
    padding: var(--spacing-xl);
  }

  .header {
    display: flex;
  }

  .title-header {
    display: grid;
    grid-template-columns: auto 45rem;
  }

  .title {
    display: inline-block;
    .description {
      font-weight: var(--font-weight-bold-2);
    }
  }

  .selected-validators {
    position: absolute;
    top: var(--spacing-xl);
    right: var(--spacing-xl);
    z-index: 2;
  }

  #staked-validators {
    max-width: 90rem;
  }

  #staking-info {
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

  .header-section {
    display: flex;
    align-items: center;
    gap: var(--spacing-xl);
    margin-bottom: var(--spacing-xl);

    .title {
      margin: 0;
    }

    #filter-btn {
      margin-left: auto;
    }
  }
</style>
