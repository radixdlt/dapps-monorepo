<script lang="ts">
  import { accounts, selectedAccount } from '@stores'
  import { shortenAddress } from '@utils'
  import { selectAcc } from './styles'
</script>

<select
  class={selectAcc}
  on:change={(e) => {
    selectedAccount.set($accounts[e.currentTarget.selectedIndex])
  }}
  name="accounts"
  style:visibility={$accounts ? 'visible' : 'hidden'}
>
  {#if $accounts}
    {#each $accounts as account}
      <option value={account}>
        {account.label}
        {shortenAddress(account.address)}
      </option>
    {/each}
  {/if}
</select>
