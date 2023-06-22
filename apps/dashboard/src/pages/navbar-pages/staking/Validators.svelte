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
  import FilterDetails from './filter-details/FilterDetails.svelte'
  import { goto } from '$app/navigation'

  export let validators: Promise<Validator[]>
  export let accounts: Promise<AccountWithStakes[]> | undefined = undefined

  context.set('validators', writable([]))
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

  let showFilterDetails = false

  $: displayedValidators = $resolvedValidators
</script>

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
        <SelectedValidators />
      {/if}
    </div>
  </div>

  <div class="divider">
    <div id="staked-validators" class="header-section">
      <h2 class="title">Your Staked Validators</h2>
      {#if accounts}
        <div class="subtext">
          Summary of your stakes for your currently connected accounts.
        </div>
      {:else}
        <div class="subtext">
          Connect your wallet and your accounts containing Radix Network stake
          pool units to see the status of your current validators and stakes.
        </div>
        <div class="info-text">
          <Icon size="medium" icon={InfoIcon} />
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
            goto(`/validators/${e.detail.address}`)
          }}
        />
      </div>
    {/if}
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
      items={displayedValidators}
      {loading}
      on:click-validator={(e) => {
        goto(`/validators/${e.detail.address}`)
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
