<script lang="ts">
  import { accounts } from "@stores"
  import { css } from "@styles"
  import { shortenAddress } from "@utils"

  const style = css({
    color: "black",
    height: 35,
    width: 140,
    marginRight: 10
  })
</script>

{#if $accounts}
  <select class={style()} name="accounts">
    {#each $accounts as account}
      <option>{account.label} {shortenAddress(account.address)}</option>
    {/each}
  </select>
{/if}
