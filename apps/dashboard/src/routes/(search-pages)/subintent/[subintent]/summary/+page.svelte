<script lang="ts">
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import Checkmark from '@icons/checkmark-green.svg'
  import SkeletonLoader from '@components/_base/skeleton-loader/SkeletonLoader.svelte'
  import type { PageData } from './$types'
  import { shortenAddress } from '@utils'
  import Link from '@components/_base/link/Link.svelte'

  export let data: PageData
</script>

<div class="tx-summary card">
  <div class="message-box">
    <div class="header">
      <div class="header-section">
        {#await data.subintent}
          <SkeletonLoader />
        {:then { status }}
          {#if status === 'CommittedSuccess'}
            <h4>Finalized at:</h4>
          {/if}
        {/await}
      </div>
      {#await data.subintent}
        <SkeletonLoader />
      {:then { status }}
        <div
          class="header-section status-section"
          class:success={status === 'CommittedSuccess'}
        >
          <div class="main-status">
            {#if status === 'CommittedSuccess'}
              <IconNew icon={Checkmark} />
            {/if}
            {status === 'CommittedSuccess' ? 'Success' : 'Unknown Status'}
          </div>
        </div>
      {/await}
    </div>
  </div>

  {#await data.subintent then { finalizedAt }}
    {#if finalizedAt}
      <Link
        url="/transaction/{finalizedAt}"
        text={shortenAddress(finalizedAt)}
      />
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
    }
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
    .message-box {
      display: flex;
      flex-direction: column;

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--spacing-2xl);
        font-size: var(--text-lg);
        font-weight: var(--font-weight-bold-2);
      }
    }
  }
</style>
