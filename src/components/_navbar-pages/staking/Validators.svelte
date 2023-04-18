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
</script>

<script lang="ts">
  import { accounts } from '@stores'
  import StakedValidatorList from './staked-validator-list/StakedValidatorList.svelte'
  import ValidatorList from './validator-list/ValidatorList.svelte'
  import Icon from '@components/_base/icon/IconNew.svelte'

  $: connected = $accounts.length > 0

  export let validators: Promise<Validator[]>
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
    <div id="staked-validators" class="section">
      <div class="header-text">Your Staked Validators</div>
      <div class="sub-text">
        {#if connected}
          <StakedValidatorList />
        {:else}
          Connect your wallet and your accounts containing Radix Network stake
          pool units to see the status of your current validators and stakes.
        {/if}
      </div>
      <div class="info-text">
        <Icon size="small" type="info" />
        What is staking?
      </div>
    </div>
  </div>

  <div class="section">
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

  .section {
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
