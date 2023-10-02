<script lang="ts">
  import { SkeletonLoader } from '@radixdlt/svelte-skeleton-loader'
  import { truncateNumber } from '@utils'

  export let apyInfo: Promise<{
    apy: number
    fee: number
    uptime: number
  }>

  export let apyWidth: number
  export let feeWidth: number
  export let uptimeWidth: number
</script>

<div class="apy-box">
  <div class="apy" bind:clientWidth={apyWidth}>
    {#await apyInfo}
      <div style:display="inline-block">
        <SkeletonLoader width={50} />
      </div>
    {:then { apy }}
      {truncateNumber(apy)}%
    {/await}
    <div class="apy-text">per year</div>
  </div>
  <div class="fee" bind:clientWidth={feeWidth}>
    {#await apyInfo}
      <SkeletonLoader width={50} />
    {:then { fee }}
      {truncateNumber(fee)}%
    {/await}
  </div>
  <div class="uptime" bind:clientWidth={uptimeWidth}>
    {#await apyInfo}
      <SkeletonLoader width={50} />
    {:then { uptime }}
      {truncateNumber(uptime)}%
    {/await}
  </div>
</div>

<style lang="scss">
  .apy-box {
    display: grid;
    grid: 1fr / auto auto auto;
  }

  .apy,
  .fee,
  .uptime {
    border: 1px solid #e2e5ed;
    text-align: center;
    padding: var(--spacing-sm) var(--spacing-xl);
  }

  .apy {
    border-radius: var(--border-radius-lg) 0 0 var(--border-radius-lg);
    background: var(--theme-surface-1);
    min-width: 10rem;
  }

  .apy-text {
    display: inline-block;
    font-size: var(--text-sm);
    color: var(--theme-subtext);
  }

  .uptime {
    border-radius: 0 var(--border-radius-lg) var(--border-radius-lg) 0;
  }
</style>
