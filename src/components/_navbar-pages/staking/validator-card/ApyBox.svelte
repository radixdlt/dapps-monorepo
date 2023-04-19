<script lang="ts">
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'

  export let apyInfo: Promise<{
    apy: number
    fee: number
    uptime: number
  }>
</script>

<div class="apy-box">
  <div class="apy">
    {#await apyInfo}
      <div style:display="inline-block">
        <SkeletonLoader width={50} />
      </div>
    {:then { apy }}
      {apy}%
    {/await}
    <div class="apy-text">per year</div>
  </div>
  <div class="fee">
    {#await apyInfo}
      <SkeletonLoader width={50} />
    {:then { fee }}
      {fee}%
    {/await}
  </div>
  <div class="uptime">
    {#await apyInfo}
      <SkeletonLoader width={50} />
    {:then { uptime }}
      {uptime}%
    {/await}
  </div>
</div>

<style lang="scss">
  @use './shared.scss';
  .apy-box {
    @include shared.apy-box-grid;
    padding: var(--spacing-sm);
  }

  .apy,
  .fee,
  .uptime {
    border: 1px solid #e2e5ed;
    width: 100%;
    text-align: center;
    padding: var(--spacing-sm) var(--spacing-xl);
  }

  .apy {
    border-radius: var(--border-radius) 0 0 var(--border-radius);
    background: var(--color-grey-5);
  }

  .apy-text {
    display: inline-block;
    font-size: var(--text-sm);
    color: var(--color-grey-2);
  }

  .uptime {
    border-radius: 0 var(--border-radius) var(--border-radius) 0;
  }
</style>
