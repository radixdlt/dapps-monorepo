<script lang="ts">
  import Divider from '@components/_base/divider/Divider.svelte'
  import SidePanel from '@components/_base/side-panel/SidePanel.svelte'
  import CloseButton from '@components/_base/side-panel/CloseButton.svelte'
  import AccountPicker from '@components/_base/picker/account-picker/AccountPicker.svelte'
  import AddStakeCard from './AddStakeCard.svelte'
  import type { ComponentProps } from 'svelte'
  import ButtonNew from '@components/_base/button/ButtonNew.svelte'
  import InfoBox from './InfoBox.svelte'
  import type { Account } from '@stores'

  export let open: boolean
  export let validatorProps: ComponentProps<AddStakeCard>

  let rightColumnWidth = '25rem'
  let selectedAccount: Account

  let stakeButtonDisabled = true
</script>

<SidePanel bind:open>
  <div class="header">
    <CloseButton on:click={() => (open = false)} />
    <h3>Add Stake</h3>
    <div />
  </div>

  <Divider />

  <div class="flex">
    <div />
    <div class="account-picker" style:width={rightColumnWidth}>
      <h4>Stake amount coming from</h4>
      <AccountPicker bind:selected={selectedAccount} />
    </div>
  </div>

  <div class="validator-header flex">
    <h4>Validator you have chosen to stake to</h4>
    <div class="align-left staking-amount-text" style:width={rightColumnWidth}>
      Total staking amount
    </div>
  </div>

  <div class="add-stake-card">
    <AddStakeCard
      {...validatorProps}
      on:invalid={(e) => {
        stakeButtonDisabled = e.detail
      }}
      --token-amount-card-width={rightColumnWidth}
    />
  </div>

  <div class="stake flex">
    <div class="info">
      <InfoBox
        title="How Staking Works"
        explanation="Explanation of how staking works"
        link={{ href: '', text: 'Learn more' }}
      />
    </div>
    <div class="stake-button" style:width={rightColumnWidth}>
      <ButtonNew size="big" disabled={stakeButtonDisabled}>Stake</ButtonNew>
    </div>
  </div>
</SidePanel>

<style lang="scss">
  .flex {
    display: flex;
    justify-content: space-between;
    padding-right: var(--spacing-lg);

    .align-left {
      text-align: left;
    }
  }

  .account-picker {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .validator-header {
    margin-top: var(--spacing-2xl);
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .staking-amount-text {
    color: var(--color-grey-2);
  }

  .add-stake-card {
    margin-top: var(--spacing-lg);
  }

  .stake-button {
    flex-shrink: 0;
  }

  .info {
    flex-basis: 100%;
  }

  .stake {
    margin-top: var(--spacing-2xl);
    gap: var(--spacing-3xl);
  }
</style>
