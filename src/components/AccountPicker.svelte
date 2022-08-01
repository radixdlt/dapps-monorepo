<script lang="ts">
  import { accounts, selectedAccount } from "@stores"
  import { css } from "@styles"
  import { shortenAddress } from "@utils"

  const style = css({
    color: "black",
    height: 35,
    width: 140,
    marginRight: 10
  })

  let selected: typeof $accounts[0]
  
  $: selectedAccount.set(selected)
</script>

{#if $accounts}
  <select class={style()} bind:value={selected} name="accounts">
    {#each $accounts as account}
      <option value={account}>
        {account.label}
        {shortenAddress(account.address)}
      </option>
    {/each}
  </select>
{/if}
