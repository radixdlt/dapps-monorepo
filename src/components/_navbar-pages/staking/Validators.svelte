<script lang="ts" context="module">
  export type Validator = {
    name: string
    address: string
    totalStake: number
    percentageOwnerStake: number
    apy: number
    fee: number
    uptime: number
    acceptsStake: boolean
    percentageTotalStake: number
  }

  export type AccountWithStakes = Account & {
    stakes: {
      validator: string
      staked: number
      unstaking: number
      readyToClaim: number
    }[]
  }
</script>

<script lang="ts">
  import StakedValidatorList from './staked-validator-list/StakedValidatorList.svelte'
  import ValidatorList from './validator-list/ValidatorList.svelte'
  import Icon from '@components/_base/icon/IconNew.svelte'
  import StakingCard from './staking-card/StakingCard.svelte'
  import type { Account } from '@stores'

  export let validators: Promise<Validator[]>
  export let accounts: Promise<AccountWithStakes[]> | undefined = undefined

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
</script>

<div id="validators">
  <div id="title-section" class="divider">
    <div id="title">Validators</div>
    <div id="description">
      View all your staked validators and list of validators available on the
      Radix Network
    </div>
  </div>

  <div class="divider">
    <div id="staked-validators" class="header-section">
      <div class="header-text">Your Staked Validators</div>
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
          <Icon size="small" type="info" />
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
        />
        <StakedValidatorList />
      </div>
    {/if}
  </div>

  <div class="header-section">
    <div class="header-text">All Validators</div>
    <div class="sub-text">
      List of validators available on the Radix Network
    </div>
  </div>

  <div>
    <ValidatorList {validators} />
  </div>
</div>

<style lang="scss">
  #validators {
    display: grid;
    padding: var(--spacing-xl);
    gap: var(--spacing-2xl);
  }

  #title-section {
    display: grid;
    gap: var(--spacing-md);

    #title {
      font-size: var(--text-3xl);
      font-weight: var(--font-weight-bold-2);
    }
    #description {
      font-weight: var(--font-weight-bold-2);
    }
  }

  #staked-validators {
    max-width: 90rem;
  }

  #staking-info {
    padding-top: var(--spacing-xl);
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

    .header-text {
      font-size: var(--text-xl);
      font-weight: var(--font-weight-bold-2);
    }

    .sub-text {
      font-size: var(--text-sm);
      color: var(--color-grey-2);
    }
  }
</style>
