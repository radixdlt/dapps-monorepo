<script lang="ts">
  import type { FormattedAccount } from '../../side-effects'
  import type { Account as AccountType } from '@stores'
  import AccountPicker from '@components/_base/picker/account-picker/AccountPicker.svelte'

  export let accounts: FormattedAccount[] | undefined
  export let selectedAccount: FormattedAccount | undefined

  let selected: AccountType

  $: if (selected) {
    selectedAccount = accounts?.find(
      (account) => account.address === selected.address
    )
  }
</script>

<AccountPicker bind:selected />
