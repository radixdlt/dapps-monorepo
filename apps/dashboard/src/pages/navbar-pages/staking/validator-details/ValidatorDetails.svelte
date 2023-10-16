<script lang="ts">
  import SidePanel from '@components/_base/side-panel/SidePanel.svelte'
  import SidePanelHeader from '@components/_base/side-panel/SidePanelHeader.svelte'
  import ExtendedStakingCard from './ExtendedStakingCard.svelte'
  import Divider from '@components/_base/divider/Divider.svelte'
  import { SkeletonLoader } from '@radixdlt/svelte-skeleton-loader'
  import { connected } from '@stores'
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import Address from '@components/_base/address/Address.svelte'
  import AcceptsStake from '../accepts-stake/AcceptsStake.svelte'
  import BookmarkValidator from '../bookmark-validator/BookmarkValidator.svelte'
  import SelectValidator from '../select-validator/SelectValidator.svelte'
  import { createEventDispatcher } from 'svelte'
  import type { Validator } from '@api/utils/entities/validator'
  import RecentUptimeDetail from './RecentUptimeDetail.svelte'
  import type { AccumulatedStakes } from '../../../../routes/(navbar-pages)/network-staking/(load-validators)/(load-staking-data)/proxy+layout'
  import SummaryMetadata from '@dashboard-pages/search-pages/SummaryMetadata.svelte'
  import { formatXRDValue, truncateNumber } from '@utils'
  import { isNil, pipe, reject } from 'ramda'
  import type { metadataItem } from '@dashboard-pages/search-pages/utils'
  import NftImage from '@components/_base/nft-image/NftImage.svelte'

  export let validator: Promise<Validator<true, true, true>>
  export let accumulatedValidatorStakes: Promise<AccumulatedStakes>

  const dispatch = createEventDispatcher<{
    close: null
  }>()

  const getNonMetadataItems = pipe(
    (validator: Validator<true, true, true>) => [
      validator.ownerAddress
        ? ['owner addres', validator.ownerAddress, 'GlobalAddress']
        : undefined,
      validator.metadata.standard.info_url
        ? ['website', validator.metadata.standard.info_url.value, 'Url']
        : undefined,
      [
        'total stake',
        formatXRDValue(validator.totalStakeInXRD.toString()),
        'String'
      ],
      ['accepts stake', validator.acceptsStake, 'Bool'],
      ['fee (%)', `${truncateNumber(validator.fee.percentage)} %`, 'String'],
      [
        'apy',
        `${
          validator.rank <= 100 ? `${truncateNumber(validator.apy)} %` : 'N/A'
        }`,
        'String'
      ],
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
      {:then { metadata: { standard: { name, icon_url } } }}
        <div class="icon-and-name">
          <NftImage url={icon_url?.value.href} />
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
          ({ metadata: { standard } }) => standard
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
