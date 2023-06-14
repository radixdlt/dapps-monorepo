<script lang="ts">
  import AccountPicker from '@components/_base/picker/account-picker/AccountPicker.svelte'
  import type { Account } from '@stores'

  export let selectedAccount: Account
</script>

<div class="account-picker" style:width="var(--width)">
  <h4><slot name="account-picker-text" /></h4>
  <AccountPicker bind:selected={selectedAccount} />
</div>

<style>
  .account-picker {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }
</style>
