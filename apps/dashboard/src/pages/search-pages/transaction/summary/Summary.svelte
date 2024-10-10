<script lang="ts">
  import Divider from '@components/_base/divider/Divider.svelte'
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import Checkmark from '@icons/checkmark-green.svg'
  import Cross from '@icons/cross-red.svg'
  import type { ComponentProps } from 'svelte'
  import AccountBalanceChanges from './AccountBalanceChanges.svelte'
  import SkeletonLoader from '@components/_base/skeleton-loader/SkeletonLoader.svelte'
  import type {
    TransactionIntentStatus,
    TransactionStatusResponse
  } from '@common/gateway-sdk'
  import { getManifestClassDescription } from '@api/helpers/get-most-relevant-manifest-class'
  import { fullDateFormatter } from '@dashboard/lib/formatters/full-date'
  import CodeBox from '@components/code-box/CodeBox.svelte'

  export let status: Promise<
    Pick<
      TransactionStatusResponse,
      'intent_status' | 'known_payloads' | 'error_message'
    >
  >
  export let timestamp: Promise<Date | undefined>
  export let manifestClass: Promise<string | undefined>
  export let message: Promise<string>
  export let balanceChanges: Promise<
    | {
        account: string
        balanceChanges: ComponentProps<AccountBalanceChanges>['balanceChanges']
      }[]
    | undefined
  >

  const statusMessages: Record<
    TransactionIntentStatus,
    {
      status: string
      info?: string
    }
  > = {
    CommittedSuccess: {
      status: 'Success',
      info: 'Committed on-ledger'
    },
    CommittedFailure: {
      status: 'Failure',
      info: 'Failure committed on-ledger'
    },
    CommitPendingOutcomeUnknown: {
      status: 'Pending',
      info: 'Outcome unknown'
    },
    PermanentlyRejected: {
      status: 'Failure',
      info: 'Permanently rejected'
    },
    LikelyButNotCertainRejection: {
      status: 'Pending',
      info: 'Rejected, but could still be accepted'
    },
    Pending: {
      status: 'Pending',
      info: 'Submitted, in process'
    },
    Unknown: {
      status: 'Unknown'
    }
  }
</script>

<div class="tx-summary card">
  <div class="message-box">
    <div class="header">
      <div class="header-section">
        {#await Promise.all([manifestClass, timestamp, status])}
          <SkeletonLoader />
        {:then [manifestClass, timestamp, status]}
          {#if timestamp}
            <div>{fullDateFormatter(timestamp)}</div>
            <div class="manifest-class">
              {getManifestClassDescription(manifestClass)}
            </div>
          {:else if status.intent_status === 'PermanentlyRejected'}
            <div class="manifest-class">
              {status.error_message}
            </div>
          {/if}
        {/await}
      </div>
      {#await status}
        <SkeletonLoader />
      {:then status}
        <div
          class="header-section status-section"
          class:success={status.intent_status === 'CommittedSuccess'}
          class:failure={status.intent_status === 'PermanentlyRejected' ||
            status.intent_status === 'CommittedFailure'}
        >
          <div class="main-status">
            <IconNew
              icon={status.intent_status === 'CommittedSuccess'
                ? Checkmark
                : Cross}
            />{statusMessages[status.intent_status].status}
          </div>
          {#if statusMessages[status.intent_status]?.info}
            <span class="descriptive-status">
              {statusMessages[status.intent_status]?.info}
            </span>
          {/if}
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

  {#await balanceChanges}
    <SkeletonLoader />
  {:then balanceChanges}
    {#if balanceChanges && balanceChanges.length > 0}
      <div class="changes-list">
        <h3 class="section-header">Asset Balance Changes</h3>
        {#each balanceChanges as changes}
          <AccountBalanceChanges
            account={changes.account}
            balanceChanges={changes.balanceChanges}
          />
        {/each}
      </div>
    {/if}
  {/await}

  {#await status}
    <SkeletonLoader />
  {:then status}
    {#if ['LikelyButNotCertainRejection', 'PermanentlyRejected'].includes(status.intent_status)}
      <h3 class="section-header">Errors</h3>
      {#each status.known_payloads as payload}
        {#if payload.error_message}
          <CodeBox text={payload.error_message} />
        {/if}
      {/each}
    {/if}
  {/await}
</div>

<style lang="scss">
  .header-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);

    &.status-section {
      align-items: flex-end;

      &.success {
        color: var(--theme-success-primary);
        .main-status {
          color: var(--theme-success-primary);
        }
      }

      &.failure {
        color: var(--theme-error-primary);
        .main-status {
          color: var(--theme-error-primary);
        }
      }
    }
  }

  .descriptive-status {
    font-weight: var(--font-weight-bold-1);
  }

  .manifest-class {
    color: var(--color-grey-2);
  }

  .main-status {
    display: flex;
    font-size: var(--text-xl);
    align-items: center;
    gap: var(--spacing-sm);
  }

  .tx-summary {
    padding: var(--spacing-2xl);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);

    @include mixins.mobile {
      padding: var(--spacing-xl);
    }

    .message-box {
      display: flex;
      flex-direction: column;
      padding: var(--spacing-2xl) var(--spacing-xl);
      border-radius: var(--border-radius-lg);
      border: var(--border) var(--theme-border);

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--spacing-2xl);
        font-size: var(--text-lg);
        font-weight: var(--font-weight-bold-2);

        .status {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
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
