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
    accumulatedStaked: number
    accumulatedUnstaking: number
    accumulatedReadyToClaim: number
  }

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
    selectedValidators: Writable<Record<string, boolean>>
    bookmarkedValidators: Writable<Record<string, boolean>>
  }>()
</script>

<script lang="ts">
  import ValidatorList from './validator-list/ValidatorList.svelte'
  import Icon from '@components/_base/icon/IconNew.svelte'
  import StakingCard from './staking-card/StakingCard.svelte'
  import type { Account } from '@stores'
  import { connected } from '@stores'
  import { useContext } from '@utils'
  import { writable, type Writable } from 'svelte/store'
  import SelectedValidators from './selected-validators/SelectedValidators.svelte'
  import ValidatorDetails from './validator-details/ValidatorDetails.svelte'
  import FilterButton from './filter-button/FilterButton.svelte'
  import FilterDetails from './filter-details/FilterDetails.svelte'

  export let validators: Promise<Validator[]>
  export let accounts: Promise<AccountWithStakes[]> | undefined = undefined

  context.set('connected', writable(false))
  context.set('validators', writable([]))
  context.set('selectedValidators', writable({}))
  context.set('bookmarkedValidators', writable({}))

  $: validators.then(context.get('validators').set)

  let bookmarkedValidators = context.get('bookmarkedValidators')

  let resolvedValidators = context.get('validators')

  const updateAccumulatedStakes = async () => {
    const _validators = await validators
    const _accounts = await accounts

    validators = Promise.resolve(
      _validators.map((validator) => {
        let accumulatedStaked = 0
        let accumulatedUnstaking = 0
        let accumulatedReadyToClaim = 0

        _accounts!.forEach((account) => {
          account.stakes.forEach((stake) => {
            if (stake.validator === validator.address) {
              accumulatedStaked += stake.staked
              accumulatedUnstaking += stake.unstaking
              accumulatedReadyToClaim += stake.readyToClaim
            }
          })
        })

        return {
          ...validator,
          accumulatedStaked,
          accumulatedUnstaking,
          accumulatedReadyToClaim
        }
      })
    )
  }

  $: accounts?.then(() => updateAccumulatedStakes())

  const getTotal =
    (type: 'staked' | 'unstaking' | 'readyToClaim') =>
    (accounts: AccountWithStakes[]) =>
      accounts.reduce(
        (prev, cur) =>
          prev + cur.stakes.reduce((prev, cur) => prev + cur[type], 0),
        0
      )

  let totalStaked = new Promise<number>(() => {})
  $: if (accounts) totalStaked = accounts.then(getTotal('staked'))

  let totalUnstaked = new Promise<number>(() => {})
  $: if (accounts) totalUnstaked = accounts.then(getTotal('unstaking'))

  let totalReadyToClaim = new Promise<number>(() => {})
  $: if (accounts) totalReadyToClaim = accounts.then(getTotal('readyToClaim'))

  let loading = true

  validators.then((_) => {
    loading = false
  })

  $: if (accounts) context.get('connected').set(true)

  let showValidatorDetails = false
  let displayedValidator: Validator | undefined

  let showFilterDetails = false

  $: displayedValidators = $resolvedValidators
</script>

{#if displayedValidator}
  <ValidatorDetails
    bind:open={showValidatorDetails}
    validator={displayedValidator}
  />
{/if}

<FilterDetails
  bind:open={showFilterDetails}
  feeValues={$resolvedValidators.map((v) => v.fee)}
  totalXRDStakeValues={$resolvedValidators.map((v) => v.percentageTotalStake)}
  ownerStakeValues={$resolvedValidators.map((v) => v.percentageOwnerStake)}
  on:applyFilter={(e) => {
    displayedValidators = $resolvedValidators.filter((v) => {
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

<div id="validators">
  <div>
    <h1>Validators</h1>
    <p id="description" class="divider">
      View all your staked validators and list of validators available on the
      Radix Network
    </p>
  </div>

  <div class="divider">
    <div id="staked-validators" class="header-section">
      <h2>Your Staked Validators</h2>
      {#if accounts}
        <div class="sub-text">
          Summary of your stakes for your currently connected accounts.
        </div>
      {:else}
        <div class="sub-text">
          Connect your wallet and your accounts containing Radix Network stake
          pool units to see the status of your current validators and stakes.
        </div>
        <div class="info-text">
          <Icon size="medium" type="info" />
          What is staking?
        </div>
      {/if}
    </div>
    {#if accounts}
      <div id="staking-info">
        <StakingCard
          staking={totalStaked}
          unstaking={totalUnstaked}
          readyToClaim={totalReadyToClaim}
          claimText="Claim All"
        />
        <ValidatorList
          type="staked"
          items={$resolvedValidators.filter(
            (v) =>
              v.accumulatedStaked !== 0 ||
              v.accumulatedUnstaking !== 0 ||
              v.accumulatedReadyToClaim !== 0
          )}
          {loading}
          on:click-validator={(e) => {
            displayedValidator = e.detail
            showValidatorDetails = true
          }}
        />
      </div>
    {/if}
  </div>

  <div class="header-section">
    <div class="header-text">All Validators</div>
    <div class="sub-text">
      List of validators available on the Radix Network
    </div>
    <div id="filter-btn">
      <FilterButton on:click={() => (showFilterDetails = true)} />
    </div>
  </div>

  <div id="selected-validators">
    {#if $connected}
      <SelectedValidators />
    {/if}
  </div>

  <div>
    <ValidatorList
      type="all"
      items={displayedValidators}
      {loading}
      on:click-validator={(e) => {
        displayedValidator = e.detail
        showValidatorDetails = true
      }}
    />
  </div>
</div>

<style lang="scss">
  @use '../../../mixins.scss';
  #validators {
    display: grid;
    padding: var(--spacing-xl);
    gap: var(--spacing-2xl);
  }

  #description {
    font-weight: var(--font-weight-bold-2);
  }

  #selected-validators {
    position: absolute;
    right: var(--spacing-2xl);
    top: var(--spacing-2xl);
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
    color: var(--color-radix-blue-2);
    gap: var(--spacing-md);
    cursor: pointer;
  }

  .divider {
    border-bottom: var(--border);
    padding-bottom: var(--spacing-2xl);
  }

  .header-section {
    display: flex;
    align-items: center;
    gap: var(--spacing-xl);

    #filter-btn {
      margin-left: auto;
    }
  }
</style>
