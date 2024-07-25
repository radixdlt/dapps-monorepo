<script lang="ts">
  import AccountPicker from '@components/_base/picker/account-picker/AccountPicker.svelte'
  import type { Account } from '@stores'

  export let selectedAccount: Account
</script>

<div class="account-picker">
  <h4>Stake XRD from account</h4>
  <AccountPicker bind:selected={selectedAccount} />
</div>

<style lang="scss">
  .account-picker {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    min-width: 20rem;

    @include mixins.mobile {
      width: 100%;
    }
  }
</style>
