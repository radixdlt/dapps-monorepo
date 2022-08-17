<script lang="ts">
  import { selectedAccount } from '@stores'
  import { shortenAddress } from '@utils'

  export let stakes: {
    stake?: number
    pendingStake?: number
  }

  export let name: string
  export let stakeAccepted: boolean
  export let totalStake: number
  export let stakePercentage: number
  export let ownerStake: number
  export let ownerStakePercentage: number
  export let feePercentage: number
  export let uptimePercentage: number
  export let address: string

  export let checked: boolean = false
</script>

{#if $selectedAccount && stakes}
  <input type="checkbox" bind:checked on:change />
  <div>{stakes.stake ?? 0}</div>
{/if}
{#each [name, stakeAccepted, `${totalStake} (${stakePercentage}%)`, `${ownerStake} (${ownerStakePercentage}%)`, feePercentage, uptimePercentage, shortenAddress(address), '...'] as text}
  <div>{text}</div>
{/each}
