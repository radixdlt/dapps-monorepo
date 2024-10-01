<script lang="ts">
  import Accordion from '@components/_base/accordion/Accordion.svelte'
  import Address from '@components/_base/address/Address.svelte'
  import NftImage from '@components/_base/nft-image/NftImage.svelte'
  import TokenIcon from '@components/_base/token-icon/TokenIcon.svelte'
  import { formatXRDValue, formatTokenValue } from '@utils'
  import BigNumber from 'bignumber.js'
  import ValueBox from './ValueBox.svelte'
  import ValidatorPlaceholder from '@icons/validator-placeholder.svg'
  import type { AccumulatedStakeInfo } from '../summary/summary'
  import { onMount } from 'svelte'
  import { validatorsCacheModule } from '@api/utils/validators-cache-module'

  export let validatorStakes: AccumulatedStakeInfo

  let isLoading: boolean

  onMount(() => {
    const subscription = validatorsCacheModule.isLoading$.subscribe((data) => {
      isLoading = data
    })

    return () => {
      subscription.unsubscribe()
    }
  })
</script>

{#key isLoading}
  {#if validatorsCacheModule}
    {@const validator = validatorsCacheModule.validators.get(
      validatorStakes.validatorAddress
    )}
    <div class="card validator-card">
      <Accordion>
        <div class="validator-header" slot="header">
          <NftImage
            url={validator?.iconUrl}
            defaultImageUrl={ValidatorPlaceholder}
            width={64}
            height={64}
          />
          <div class="validator-header-info">
            <div class="validator-header-name">
              <h4>
                {validator?.name || ''}
              </h4>
              <Address
                value={validatorStakes.validatorAddress}
                autoShorten
                --background="var(--theme-surface-3)"
              />
            </div>

            <div class="staked-header-info">
              Staked {formatXRDValue(validatorStakes.accumulatedStakes)}
            </div>
          </div>
        </div>
        <svelte:fragment slot="content">
          <div class="units-section">
            <div class="content-section-header">
              <TokenIcon
                iconUrl="https://assets.radixdlt.com/icons/icon-liquid_stake_units.png"
              />
              <span class="text">Liquid Stake Units</span>
              <span class="value"
                >{formatTokenValue(validatorStakes.accumulatedLiquidStakeUnits)
                  .displayValue}</span
              >
            </div>

            <ValueBox
              header="Worth"
              address={validator?.poolUnitResourceAddress || ''}
              value={validatorStakes.accumulatedStakes}
            />
          </div>

          {#if validatorStakes.unstaking.length || validatorStakes.readyToClaim.length}
            <div class="units-section">
              <div class="content-section-header">
                <NftImage
                  url="https://assets.radixdlt.com/icons/icon-stake_claim_NFTs.png"
                  width={44}
                  height={44}
                />

                <span class="text">Stake Claims</span>
              </div>
              {#each validatorStakes.unstaking as stakeEntry}
                <ValueBox
                  header="Unstaking"
                  address={validator?.poolUnitResourceAddress || ''}
                  value={BigNumber(stakeEntry.xrdAmount)}
                />
              {/each}

              {#each validatorStakes.readyToClaim as stakeEntry}
                <ValueBox
                  header="Ready to Claim"
                  address={stakeEntry.claimNft.address.nonFungibleAddress}
                  value={BigNumber(stakeEntry.xrdAmount)}
                />
              {/each}
            </div>
          {/if}
        </svelte:fragment>
      </Accordion>
    </div>
  {/if}
{/key}

<style lang="scss">
  .validator-card {
    width: 100%;
  }

  .units-section {
    border-top: 1px solid var(--color-grey-4);
    margin: 0 calc(-1 * var(--spacing-2xl)) 0;
    padding: var(--spacing-xl) var(--spacing-2xl);

    &:first-of-type {
      margin-top: var(--spacing-2xl);
    }
  }

  .content-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
    .text {
      font-weight: var(--font-weight-bold-1);
      font-size: var(--text-lg);
      margin-right: auto;
    }
    .value {
      font-weight: var(--font-weight-bold-1);
      font-size: var(--text-lg);
      margin-left: auto;
    }
  }

  .validator-header-name {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
  }

  .validator-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
  }

  .validator-header-info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .staked-header-info {
    color: var(--color-grey-2);
  }

  .card-content {
    display: flex;
    padding: var(--spacing-2xl) 0;

    & > :global(.stake-display) {
      flex-grow: 1;
      padding: 0 var(--spacing-2xl);

      &:first-child {
        padding-left: 0;
      }

      &:last-child {
        padding-right: 0;
      }

      &:not(:last-child) {
        border-right: var(--border-divider) var(--theme-border);
      }
    }
  }
  .card-footer {
    padding: var(--spacing-lg) var(--spacing-2xl);
    display: flex;
    align-items: center;
    border: var(--border) var(--theme-border);
    border-top: none;
    border-radius: 0 0 var(--border-radius-lg) var(--border-radius-lg);
    background: var(--theme-surface-1);
    margin: 0 calc(-1 * var(--spacing-2xl)) calc(-1 * var(--spacing-2xl));
  }
</style>
