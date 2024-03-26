<script lang="ts">
  import type { Change } from '@api/helpers/stream-transactions-extensions'
  import { resourcesCacheClient } from '@api/utils/resource-cache-client'
  import NftImage from '@components/_base/nft-image/NftImage.svelte'
  import TokenIcon from '@components/_base/token-icon/TokenIcon.svelte'
  import { formatTokenValue } from '@utils'
  import { onMount } from 'svelte'

  export let balanceChanges: Change[]

  let isLoading: boolean

  onMount(() => {
    const subscription = resourcesCacheClient.isLoading$.subscribe((data) => {
      isLoading = data
    })

    return () => {
      subscription.unsubscribe()
    }
  })
</script>

{#if !balanceChanges.length}
  <span class="empty">None</span>
{:else}
  <div class="changes">
    {#key isLoading}
      {#each balanceChanges as change}
        {#if change.type === 'fungible'}
          {@const fungible = resourcesCacheClient.fungibleResources.get(
            change.address
          )}
          <div class="balance-change">
            <TokenIcon
              iconUrl={fungible?.metadata.standard.icon_url?.value.href}
              --size="24px"
            />
            {#if fungible?.validator}
              <div class="nft-info">
                <a href="/resource/{change.address}">
                  {fungible?.metadata.standard.symbol?.value ||
                    fungible?.metadata.standard.name?.value ||
                    ''}
                </a>
                <span class="secondary-text">
                  {fungible?.validator.name || ''}
                </span>
              </div>
            {:else}
              <a href="/resource/{change.address}">
                {fungible?.metadata.standard.symbol?.value ||
                  fungible?.metadata.standard.name?.value ||
                  ''}
              </a>
            {/if}
            <span class="fungible-value">
              {formatTokenValue(change.amount).displayValue}</span
            >
          </div>
        {:else if change.type === 'nonFungible'}
          {@const nonFungible = resourcesCacheClient.nonFungibleResources.get(
            change.address
          )}
          {@const nonFungibleData =
            resourcesCacheClient.nonFungibleResourcesData.get(
              `${change.address}:${change.localId}`
            )}
          <div class="balance-change">
            <NftImage
              url={nonFungible?.metadata.standard.icon_url?.value.href}
              simple
              --size="24px"
            />
            <div class="nft-info">
              <a
                href="/resource/{encodeURIComponent(
                  `${change.address}:${change.localId}`
                )}"
              >
                {nonFungible?.displayName || ''}
              </a>
              <span class="secondary-text">
                {#if nonFungible?.validator}
                  {nonFungible?.validator.name || ''}
                {:else}
                  {nonFungibleData?.nftData.expected.name?.value || ''}
                {/if}
              </span>
            </div>
          </div>
        {/if}
      {/each}
    {/key}
  </div>
{/if}

<style lang="scss">
  .changes {
    padding: var(--spacing-lg);
    border: 1px solid var(--color-grey-4);
    border-radius: var(--border-radius-lg);

    .balance-change:not(:last-child) {
      border-bottom: 1px solid var(--color-grey-4);
      padding-bottom: var(--spacing-lg);
    }

    .balance-change:not(:first-child) {
      padding-top: var(--spacing-lg);
    }
  }

  .balance-change {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);

    font-weight: var(--font-weight-bold-2);
  }

  .secondary-text {
    font-weight: normal;
    color: var(--color-grey-2);
  }

  .nft-info {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
  }

  .fungible-value {
    margin-left: auto;
  }

  a:hover {
    text-decoration: underline;
  }

  .empty {
    color: var(--color-grey-3);
    font-weight: var(--font-weight-bold-1);
  }
</style>
