<script lang="ts">
  import Select from '@components/_base/select/Select.svelte'
  import { accounts, selectedAccount } from '@stores'
  import { shortenAddress } from '@utils'
</script>

<Select
  onChange={(e) =>
    selectedAccount.set($accounts[e.currentTarget.selectedIndex])}
  visible={!!$accounts}
  size={{
    width: '$3xl'
  }}
>
  {#if $accounts}
    {#each $accounts as account}
      <option value={account}>
        {account.label}
        {shortenAddress(account.address)}
      </option>
    {/each}
  {/if}
</Select>
