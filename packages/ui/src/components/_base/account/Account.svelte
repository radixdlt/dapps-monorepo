<script lang="ts">
  import type { Account } from '@stores'
  import { shortenAddress } from '@utils'

  export let account: Account | undefined = undefined
</script>

<div class="option gradient-{account?.appearanceId ?? 'empty'}">
  <span class="label">{account?.label || ''}</span>
  <div class="wrapper">
    <span class="address">{shortenAddress(account?.address)}</span>
    <slot />
  </div>
</div>

<style lang="scss">
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;

    & > :global(:not(:first-child)) {
      margin-left: 15px;
    }
  }

  .address {
    color: #fff;
    opacity: 0.8;
  }

  .label {
    font-weight: var(--font-weight-bold-2);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .option {
    color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 var(--spacing-xl);
    border-radius: var(--border-radius-xl);
    min-height: 2.5rem;
    max-height: 3rem;
    height: 100%;
    width: 100%;
  }

  .gradient-empty {
    background: linear-gradient(276.58deg, #c9c9c9 -0.6%, #636363 102.8%);
  }
  .gradient-0 {
    background: linear-gradient(276.58deg, #01e2a0 -0.6%, #052cc0 102.8%);
  }
  .gradient-1 {
    background: linear-gradient(276.33deg, #ff43ca -14.55%, #052cc0 102.71%);
  }
  .gradient-2 {
    background: linear-gradient(276.33deg, #20e4ff -14.55%, #052cc0 102.71%);
  }
  .gradient-3 {
    background: linear-gradient(94.8deg, #00ab84 -1.2%, #052cc0 103.67%);
  }
  .gradient-4 {
    background: linear-gradient(94.62deg, #ce0d98 -10.14%, #052cc0 104.1%);
  }
  .gradient-5 {
    background: linear-gradient(276.33deg, #052cc0 -14.55%, #0dcae4 102.71%);
  }
  .gradient-6 {
    background: linear-gradient(90.89deg, #003057 -2.21%, #03d597 102.16%);
  }
  .gradient-7 {
    background: linear-gradient(276.23deg, #f31dbe -2.1%, #003057 102.67%);
  }
  .gradient-8 {
    background: linear-gradient(276.48deg, #003057 -0.14%, #052cc0 102.77%);
  }
  .gradient-9 {
    background: linear-gradient(276.32deg, #1af4b5 -5.15%, #0ba97d 102.7%);
  }
  .gradient-10 {
    background: linear-gradient(276.23deg, #e225b3 -2.1%, #7e0d5f 102.67%);
  }
  .gradient-11 {
    background: linear-gradient(276.48deg, #1f48e2 -0.14%, #040b72 102.77%);
  }
</style>
