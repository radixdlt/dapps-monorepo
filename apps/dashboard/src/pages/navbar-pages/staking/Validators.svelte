<script lang="ts" context="module">
  import InfoIcon from '@icons/info.svg'
  import Cross from '@icons/cross-2.svg'

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
  import Icon from '@components/_base/icon/IconNew.svelte'
  import StakingCard from '../../../lib/staking-card/StakingCard.svelte'

  import ButtonNew from '@components/_base/button/ButtonNew.svelte'
  import { connected, type Account } from '@stores'
  import { useContext } from '@utils'
  import { writable, type Writable } from 'svelte/store'
  import SelectedValidators from './selected-validators/SelectedValidators.svelte'
  import FilterButton from './filter-button/FilterButton.svelte'
  import { goto } from '$app/navigation'
  import BigNumber from 'bignumber.js'
  import { createEventDispatcher } from 'svelte'
  import Divider from '@components/_base/divider/Divider.svelte'
  import type { Validator } from '@api/_deprecated/utils/entities/validator'
  import type { StakeInfo } from '@api/_deprecated/utils/staking'
  import { stakeInfo } from '../../../routes/(navbar-pages)/network-staking/(load-validators)/(load-staking-data)/+layout.svelte'
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import type { ValidatorListItem } from '@api/utils/entities/component/validator'
  import AvailableToStake from './available-to-stake/AvailableToStake.svelte'
  import { track } from '../../../routes/+layout.svelte'
  import type { ResultAsync } from 'neverthrow'
  import ValidatorListWrapper from './validator-list/ValidatorListWrapper.svelte'

  export let validators: Promise<ValidatorListItem<true, true>[]>
  export let totalXrdBalance: ResultAsync<string, { code: string }>
  export let filteredValidators: ValidatorListItem<true, true>[] | undefined =
    undefined

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
    'show-filters': undefined
    'reset-filters': undefined
  }>()
</script>

<div class="title-header">
  <div class="title">
    <h1>Radix Network Staking</h1>
    <p class="description">
      View all currently registered Radix Network validator nodes, and manage
      your own XRD stakes to validators.
    </p>
  </div>
</div>

<div class="selected-validators">
  {#if $connected}
    <SelectedValidators
      on:stake-selected={() => {
        let selected = Object.keys($selectedValidators).filter(
          (key) => $selectedValidators[key]
        )

        goto(
          selected.length === 1
            ? `/network-staking/${selected[0]}/stake`
            : '/network-staking/stake-multiple'
        )
      }}
      on:clear-all={() => {
        $selectedValidators = {}
      }}
    />
  {/if}
</div>

<Divider --spacing="var(--spacing-2xl)" />

<div id="staked-validators" class="header-section">
  <h3 class="title">Your Stakes</h3>
  {#if !$connected}
    <div class="subtext">
      Connect your wallet and your accounts containing Radix Network stake pool
      units to see the status of your current validators and stakes.
    </div>
    <a
      href="https://learn.radixdlt.com/article/start-here-radix-staking-introduction"
      target="_blank"
      class="info-text"
    >
      <Icon icon={InfoIcon} />
      What is staking?
    </a>
  {:else}
    <div class="subtext">
      Summary of your current stakes and requested unstakes for the accounts you
      have connected.
    </div>
  {/if}

  <div class="available-to-stake">
    <AvailableToStake xrdAvailableToStake={totalXrdBalance} />
  </div>
</div>

{#if $connected}
  <div id="staking-info">
    <StakingCard
      staking={totalStaked}
      unstaking={totalUnstaking}
      readyToClaim={totalReadyToClaim}
    >
      <div slot="additional-section">
        {#await totalReadyToClaim}
          <ButtonNew disabled={true} size="big" on:click>Claim All</ButtonNew>
        {:then readyToClaim}
          <ButtonNew
            disabled={new BigNumber(readyToClaim).eq(0)}
            size="big"
            on:click={() => {
              track('click:claim-all')
              goto('/network-staking/claim-multiple')
            }}>Claim All</ButtonNew
          >
        {/await}
      </div>
    </StakingCard>

    <ValidatorListWrapper
      validators={validators.then((v) =>
        $stakeInfo.then((stakes) =>
          v.filter(
            (v) =>
              stakes.staked.some((s) => s.validator.address === v.address) ||
              stakes.unstaking.some((s) => s.validator.address === v.address) ||
              stakes.readyToClaim.some((s) => s.validator.address === v.address)
          )
        )
      )}
      showStakeInfo
      amountOfPlaceholders={3}
      on:claim-validator={(e) => {
        goto(`/network-staking/claim/${e.detail}`)
      }}
    />
  </div>
{/if}

<Divider --spacing="var(--spacing-xl)" />

<div class="header-section">
  <h3 class="title">Validator Nodes</h3>
  <div class="subtext">
    Full list of validator nodes currently registered on the Radix Network.
  </div>

  <div id="filter-btn">
    {#if filteredValidators}
      <button
        class="reset-filters"
        on:click={() => {
          dispatch('reset-filters')
        }}
      >
        <IconNew faded icon={Cross} />
      </button>
    {/if}
    <FilterButton
      on:click={() => {
        track('click:filter-button')
        dispatch('show-filters')
      }}
    />
  </div>
</div>

<ValidatorListWrapper
  validators={filteredValidators ?? validators}
  amountOfPlaceholders={15}
  on:click-validator={(e) => {
    goto(`/network-staking/${e.detail}`)
  }}
/>

<style lang="scss">
  .title-header {
    max-width: 25rem;
  }

  .title {
    display: inline-block;
    .description {
      font-weight: var(--font-weight-bold-2);
    }
  }

  .selected-validators {
    position: sticky;
    top: var(--spacing-xl);
    right: var(--spacing-2xl);
    z-index: 2;

    @include mixins.mobile {
      margin-top: var(--spacing-lg);
      top: var(--spacing-md);
    }

    @include mixins.desktop {
      position: absolute;
    }
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
  }

  [slot='additional-section'] {
    display: flex;
    align-items: center;
    margin-left: auto;
  }

  .header-section {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--spacing-xl);
    margin-bottom: var(--spacing-2xl);

    @include mixins.desktop {
      flex-wrap: nowrap;
    }

    .title {
      margin: 0;
    }

    #filter-btn {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: var(--spacing-lg);

      .reset-filters {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        background: var(--color-grey-4);
      }
    }

    @include mixins.mobile {
      .available-to-stake {
        width: 100%;
      }
    }

    @include mixins.desktop {
      .available-to-stake {
        margin-left: auto;
      }
    }
  }
</style>
