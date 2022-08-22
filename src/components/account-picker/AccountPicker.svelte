<script lang="ts">
  import { accounts, selectedAccount } from '@stores'
  import { shortenAddress } from '@utils'
  import { selectAcc } from './styles'

  let selected: typeof $accounts[0]

  $: selectedAccount.set(selected)
</script>

{#if $accounts}
  <select class={selectAcc} bind:value={selected} name="accounts">
    {#each $accounts as account}
      <option value={account}>
        {account.label}
        {shortenAddress(account.address)}
      </option>
    {/each}
  </select>
{/if}
