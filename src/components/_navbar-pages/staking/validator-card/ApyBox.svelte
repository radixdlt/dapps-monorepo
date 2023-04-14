<script lang="ts">
  export let apy: number
  export let fee: number
  export let uptime: number
</script>

<div class="apy-box">
  <div class="apy">
    {apy}%
    <div class="apy-text">per year</div>
  </div>
  <div class="fee">
    {fee}%
  </div>
  <div class="uptime">
    {uptime}%
  </div>
</div>

<style>
  .apy-box {
    display: grid;
    grid: 1fr / 10rem 1fr 1fr;
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
