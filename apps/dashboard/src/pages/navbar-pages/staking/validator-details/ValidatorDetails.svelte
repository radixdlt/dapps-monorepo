<script lang="ts">
  import SidePanel from '@components/_base/side-panel/SidePanel.svelte'
  import SidePanelHeader from '@components/_base/side-panel/SidePanelHeader.svelte'
  import ExtendedStakingCard from './ExtendedStakingCard.svelte'
  import Divider from '@components/_base/divider/Divider.svelte'
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import { connected } from '@stores'
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import Address from '@components/_base/address/Address.svelte'
  import AcceptsStake from '../accepts-stake/AcceptsStake.svelte'
  import BookmarkValidator from '../bookmark-validator/BookmarkValidator.svelte'
  import SelectValidator from '../select-validator/SelectValidator.svelte'
  import { createEventDispatcher } from 'svelte'
  import Metadata from '@components/metadata/Metadata.svelte'
  import type { Validator } from '@api/utils/entities/validator'
  import { metadataItem } from '@dashboard-pages/search-pages/utils'
  import RecentUptimeDetail from './RecentUptimeDetail.svelte'
  import type { AccumulatedStakes } from '../../../../routes/(navbar-pages)/network-staking/(load-validators)/(load-staking-data)/proxy+layout'

  export let validator: Promise<Validator>
  export let accumulatedValidatorStakes: Promise<AccumulatedStakes>

  const dispatch = createEventDispatcher<{
    close: null
  }>()
</script>

<SidePanel useBackdrop on:close>
  <SidePanelHeader text="Validator" on:closeClick={() => dispatch('close')}>
    <BookmarkValidator {validator} withText />
  </SidePanelHeader>

  <div class="validator-name">
    {#await validator}
      <SkeletonLoader />
    {:then { metadata: { standard: { name } } }}
      <h1 class="dotted-overflow">{name?.value ?? '<no-name>'}</h1>
    {/await}
    <SelectValidator {validator} text="SELECT VALIDATOR" />
  </div>
  <div class="subheader">
    {#await validator}
      <SkeletonLoader />
    {:then { address }}
      <Address value={address} --background="var(--theme-surface-3)" />
    {/await}
  </div>

  {#if $connected}
    <div>
      <ExtendedStakingCard
        staked={validator.then((v) =>
          accumulatedValidatorStakes.then(
            (accum) => accum[v.address].accumulatedStakes
          )
        )}
        unstaking={validator.then((v) =>
          accumulatedValidatorStakes.then(
            (accum) => accum[v.address].accumulatedUnstaking
          )
        )}
        readyToClaim={validator.then((v) =>
          accumulatedValidatorStakes.then(
            (accum) => accum[v.address].accumulatedReadyToClaim
          )
        )}
        claimText="Claim"
        validatorAddress={validator.then((v) => v.address)}
        on:add-stake
        on:unstake
        on:claim
      />
    </div>
    <Divider />
  {/if}

  <div class="card">
    <InfoBox header="Validator Details" --background="var(--theme-surface-1)">
      <Metadata
        metadata={validator.then((validator) => {
          const extraData = [
            metadataItem('total stake', validator.totalStakeInXRD, 'U64'),
            metadataItem('accepts stake', validator.acceptsStake, 'Bool'),
            metadataItem('fee (%)', `${validator.fee} %`, 'String'),
            metadataItem(
              'recent uptime',
              validator.uptimePercentages,
              'String'
            ),
            metadataItem('owner stake', validator.ownerStake, 'U64')
          ]
          if (validator.metadata.standard.website)
            extraData.push(
              metadataItem(
                'website',
                validator.metadata.standard.website.value,
                'Url'
              )
            )

          if (validator.ownerAddress)
            extraData.push(
              metadataItem(
                'owner address',
                validator.ownerAddress,
                'GlobalAddress'
              )
            )

          return extraData.concat(validator.metadata.nonStandard)
        })}
        expectedEntries={{
          'accepts stake': {
            label: 'Accepts Stake',
            component: AcceptsStake,
            componentProperties: (item) => ({
              slot: 'right',
              value: item.typed.type === 'Bool' ? item.typed.value : false
            })
          },
          'recent uptime': {
            label: 'Recent Uptime',
            component: RecentUptimeDetail,
            componentProperties: (item) => ({
              uptimes: item.typed.type === 'String' ? item.typed.value : []
            })
          }
        }}
      />
    </InfoBox>
  </div>
</SidePanel>

<style lang="scss">
  .validator-name {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-lg);
  }

  .subheader {
    margin-bottom: var(--spacing-xl);
  }
</style>
