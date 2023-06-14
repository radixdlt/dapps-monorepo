<script lang="ts">
  import Divider from '@components/_base/divider/Divider.svelte'
  import SidePanel from '@components/_base/side-panel/SidePanel.svelte'
  import CloseButton from '@components/_base/side-panel/CloseButton.svelte'
  import AccountPicker from '@components/_base/picker/account-picker/AccountPicker.svelte'
  import ButtonNew from '@components/_base/button/ButtonNew.svelte'
  import InfoBox from './InfoBox.svelte'
  import type { Account } from '@stores'

  export let open: boolean
  export let stakeButtonDisabled = true

  let rightColumnWidth = '25rem'
  let selectedAccount: Account
</script>

<SidePanel bind:open>
  <div class="header">
    <CloseButton on:click={() => (open = false)} />
    <h3><slot name="title" /></h3>
    <div />
  </div>

  <Divider />

  <div class="flex">
    <div />
    <div class="account-picker" style:width={rightColumnWidth}>
      <h4><slot name="account-picker-text" /></h4>
      <AccountPicker bind:selected={selectedAccount} />
    </div>
  </div>

  <slot name="content" {rightColumnWidth} />

  <div class="stake flex">
    <div class="info">
      <InfoBox link={{ href: '', text: 'Learn more' }}>
        <slot name="info-box-title" slot="title" />
        <slot name="info-box-explanation" slot="explanation" />
      </InfoBox>
    </div>
    <div class="stake-button" style:width={rightColumnWidth}>
      <ButtonNew size="big" disabled={stakeButtonDisabled}>
        <slot name="button-text" />
      </ButtonNew>
    </div>
  </div>
</SidePanel>

<style lang="scss">
  .flex {
    display: flex;
    justify-content: space-between;
    padding-right: var(--spacing-lg);
  }

  .account-picker {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
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
