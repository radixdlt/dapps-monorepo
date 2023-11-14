<script lang="ts">
  import Divider from '@components/_base/divider/Divider.svelte'
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import Checkmark from '@icons/green-check.svg'
  import Cross from '@icons/cross.svg'
  import type { ComponentProps } from 'svelte'
  import AccountBalanceChanges from './AccountBalanceChanges.svelte'
  import { SkeletonLoader } from '@radixdlt/svelte-skeleton-loader'

  export let status: Promise<'Complete' | 'Failure'>
  export let timestamp: Promise<Date | undefined>
  export let message: Promise<string>
  export let balanceChanges: Promise<
    | {
        account: string
        balanceChanges: ComponentProps<AccountBalanceChanges>['balanceChanges']
      }[]
    | undefined
  >
</script>

<div class="tx-summary card">
  <div class="message-box">
    <div class="header">
      <div>
        {#await timestamp}
          <SkeletonLoader />
        {:then timestamp}
          {timestamp ?? ''}
        {/await}
      </div>
      {#await status}
        <SkeletonLoader />
      {:then status}
        <div
          class="status"
          class:success={status === 'Complete'}
          class:failure={status === 'Failure'}
        >
          <IconNew icon={status === 'Complete' ? Checkmark : Cross} />
          {status}
        </div>
      {/await}
    </div>

    {#await message then message}
      {#if message}
        <Divider />
      {/if}
    {/await}

    <div class="body">
      {#await message}
        <SkeletonLoader />
      {:then message}
        {#if message}
          <h5 class="title">Message</h5>
          <p class="subtext">
            {message}
          </p>
        {/if}
      {/await}
    </div>
  </div>

  <div class="changes-list">
    {#await balanceChanges}
      <SkeletonLoader />
    {:then balanceChanges}
      {#if balanceChanges && balanceChanges.length > 0}
        <h3 class="section-header">Asset Balance Changes</h3>
        {#each balanceChanges as changes}
          <AccountBalanceChanges
            account={changes.account}
            balanceChanges={changes.balanceChanges}
          />
        {/each}
      {/if}
    {/await}
  </div>
</div>

<style lang="scss">
  .tx-summary {
    padding: var(--spacing-2xl);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);

    .message-box {
      display: flex;
      flex-direction: column;
      padding: var(--spacing-2xl);
      border-radius: var(--border-radius-lg);
      border: var(--border) var(--theme-border);

      .header {
        display: flex;
        justify-content: space-between;
        font-size: var(--text-lg);
        font-weight: var(--font-weight-bold-2);

        .status {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .success {
          color: var(--theme-success-primary);
        }

        .failure {
          color: var(--theme-error-primary);
        }
      }

      .body {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xl);

        .title {
          font-weight: var(--font-weight-bold-2);
        }
      }
    }

    .section-header {
      font-weight: var(--font-weight-bold-2);
      margin-top: var(--spacing-lg);
    }

    .changes-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2xl);
    }
  }
</style>