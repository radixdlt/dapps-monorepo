<script lang="ts">
  import SidePanel from '@components/_base/side-panel/SidePanel.svelte'
  import SidePanelHeader from '@components/_base/side-panel/SidePanelHeader.svelte'
  import ExtendedStakingCard from './ExtendedStakingCard.svelte'
  import Divider from '@components/_base/divider/Divider.svelte'
  import SkeletonLoader from '@components/_base/skeleton-loader/SkeletonLoader.svelte'
  import { connected } from '@stores'
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import Address from '@components/_base/address/Address.svelte'
  import AcceptsStake from '../accepts-stake/AcceptsStake.svelte'
  import BookmarkValidator from '../bookmark-validator/BookmarkValidator.svelte'
  import SelectValidator from '../select-validator/SelectValidator.svelte'
  import { createEventDispatcher } from 'svelte'
  import RecentUptimeDetail from './RecentUptimeDetail.svelte'
  import type { AccumulatedStakes } from '../../../../routes/(navbar-pages)/network-staking/(load-validators)/(load-staking-data)/proxy+layout'
  import SummaryMetadata from '@dashboard-pages/search-pages/SummaryMetadata.svelte'
  import { formatXRDValue, truncateNumber } from '@utils'
  import { isNil, pipe, reject } from 'ramda'
  import type { metadataItem } from '@dashboard-pages/search-pages/utils'
  import NftImage from '@components/_base/nft-image/NftImage.svelte'
  import { PERCENTAGE_TOTAL_STAKE_WARNING } from '@constants'
  import StakeDisplay from '../validator-list/StakeDisplay.svelte'
  import ValidatorPlaceholder from '@icons/validator-placeholder.svg'
  import type { ValidatorListItem } from '@api/utils/entities/component/validator'

  export let validator: Promise<ValidatorListItem<true, true, true>>
  export let accumulatedValidatorStakes: Promise<AccumulatedStakes>
  export let currentEpoch: number

  const dispatch = createEventDispatcher<{
    close: null
  }>()

  const getNonMetadataItems = pipe(
    (validator: ValidatorListItem<true, true, true>) => [
      validator.ownerAddress
        ? ['owner address', validator.ownerAddress, 'GlobalAddress']
        : undefined,
      validator.metadata.expected.info_url
        ? ['website', validator.metadata.expected.info_url.value, 'Url']
        : undefined,
      [
        'total stake',
        formatXRDValue(validator.totalStakeInXRD.toString()),
        'String'
      ],
      ['accepts stake', validator.acceptsStake, 'Bool'],
      [
        'fee (%)',
        `${truncateNumber(validator.fee(currentEpoch).percentage)} %`,
        'String'
      ],
      ['apy', `${truncateNumber(validator.apy)} %`, 'String'],
      ['recent uptime', validator.uptimePercentages, 'String'],
      ['owner stake', formatXRDValue(validator.ownerStake.toString()), 'String']
    ],
    reject((item) => isNil(item)),
    (items) => items as Parameters<typeof metadataItem>[]
  )
</script>

<SidePanel useBackdrop on:close>
  <SidePanelHeader text="Validator" on:closeClick={() => dispatch('close')}>
    <BookmarkValidator {validator} withText />
  </SidePanelHeader>

  <div class="header">
    <div class="validator-name">
      {#await validator}
        <SkeletonLoader />
      {:then { metadata: { expected: { name, icon_url } } }}
        <div class="icon-and-name">
          <NftImage
            url={icon_url?.value?.href}
            width={64}
            height={64}
            defaultImageUrl={ValidatorPlaceholder}
          />
          <h1 class="dotted-overflow">{name?.value ?? '<no-name>'}</h1>
        </div>
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
        acceptsStake={validator.then((v) => v.acceptsStake)}
        showTopValidatorWarning={validator.then(
          (v) => v.percentageTotalStake >= PERCENTAGE_TOTAL_STAKE_WARNING
        )}
        on:add-stake
        on:unstake
        on:claim
      />
    </div>
    <Divider />
  {/if}

  <div class="card">
    <InfoBox header="Validator Details" --background="var(--theme-surface-1)">
      <SummaryMetadata
        standardMetadata={validator.then(
          ({ metadata: { expected } }) => expected
        )}
        nonMetadataItems={validator.then(getNonMetadataItems)}
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
          },
          'total stake': {
            label: 'Total Stake',
            component: StakeDisplay,
            componentProperties: (item) => ({
              validator
            })
          }
        }}
        omittedKeys={['info_url']}
      />
    </InfoBox>
  </div>
</SidePanel>

<style lang="scss">
  .validator-name {
    display: flex;
    justify-content: space-between;
    gap: var(--spacing-lg);
  }
  .header {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }
  .subheader {
    margin-bottom: var(--spacing-xl);
  }

  .icon-and-name {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
  }

  h1 {
    margin: 0;
  }
</style>
