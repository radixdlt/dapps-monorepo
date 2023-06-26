<script lang="ts">
  import SidePanel from '@components/_base/side-panel/SidePanel.svelte'
  import { formatAmount, shortenAddress } from '@utils'
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import ExtendedStakingCard from './ExtendedStakingCard.svelte'
  import Checkbox from '@components/_base/checkbox/Checkbox.svelte'
  import Divider from '@components/_base/divider/Divider.svelte'
  import CloseButton from '@components/_base/side-panel/CloseButton.svelte'
  import CopyIcon from '@icons/copy.svg'
  import BookmarkEmptyIcon from '@icons/bookmark-empty.svg'
  import BookmarkFilledIcon from '@icons/bookmark-filled.svg'
  import { setFavoriteValidator } from '../../../../server/validators/validators-api'
  import { bookmarkedValidatorsStore } from '../../../../stores'
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import { connected } from '@stores'
  import { selectedValidators, type Validator } from '../Validators.svelte'

  export let open: boolean
  export let validator: Promise<Validator>
</script>

<SidePanel bind:open>
  <div id="validator-details">
    <div id="top-row">
      <CloseButton on:click={() => (open = false)} />
      <h3>Validator</h3>
      {#if $connected}
        {#await validator}
          <SkeletonLoader />
        {:then validator}
          <button
            id="bookmarked"
            on:click={() => {
              $bookmarkedValidatorsStore[validator.address] =
                !$bookmarkedValidatorsStore[validator.address]
              bookmarkedValidatorsStore.set($bookmarkedValidatorsStore)
              setFavoriteValidator(
                validator.address,
                $bookmarkedValidatorsStore[validator.address]
              ).mapErr(() => {
                $bookmarkedValidatorsStore[validator.address] =
                  !$bookmarkedValidatorsStore[validator.address]
                bookmarkedValidatorsStore.set($bookmarkedValidatorsStore)
              })
            }}
          >
            <IconNew
              icon={$bookmarkedValidatorsStore[validator.address]
                ? BookmarkFilledIcon
                : BookmarkEmptyIcon}
              size="medium"
            />
            Bookmarked
          </button>
        {/await}
      {/if}
    </div>
    <Divider />
    <div id="name">
      <h2>
        {#await validator}
          <SkeletonLoader />
        {:then validator}
          {validator.name}
        {/await}
      </h2>
      <a id="address">
        {#await validator}
          <SkeletonLoader />
        {:then validator}
          {shortenAddress(validator.address)}
          <IconNew icon={CopyIcon} size="medium" />
        {/await}
      </a>
    </div>

    <div id="select">
      {#if $connected}
        {#await validator then validator}
          <Checkbox
            bind:checked={$selectedValidators[validator.address]}
            on:checked={() => {
              $selectedValidators = $selectedValidators
            }}
            on:unchecked={() => {
              $selectedValidators = $selectedValidators
            }}
            --label-color="var(--color-grey-2)"
          >
            SELECT VALIDATOR
          </Checkbox>
        {/await}
      {/if}
    </div>

    {#if $connected}
      <div>
        <ExtendedStakingCard
          staked={validator.then((v) => v.accumulatedStaked)}
          unstaking={validator.then((v) => v.accumulatedUnstaking)}
          readyToClaim={validator.then((v) => v.accumulatedReadyToClaim)}
          claimText="Claim"
          on:add-stake
          on:unstake
        />
      </div>
      <Divider />
    {/if}

    <div id="details">
      <h3>Validator Details</h3>
      <div class="row">
        <div>ADDRESS</div>
        {#await validator}
          <SkeletonLoader />
        {:then validator}
          <a>{shortenAddress(validator.address)}</a>
        {/await}
      </div>
      <div class="row">
        <div>OWNER ADDRESS</div>
        {#await validator}
          <SkeletonLoader />
        {:then validator}
          <a>{shortenAddress(validator.ownerAddress)}</a>
        {/await}
      </div>
      <div class="row">
        <div>WEBSITE</div>
        {#await validator}
          <SkeletonLoader />
        {:then validator}
          <a>{validator.website}</a>
        {/await}
      </div>
      <div class="row">
        <div>TOTAL STAKE</div>
        {#await validator}
          <SkeletonLoader />
        {:then validator}
          <div>{validator.totalStake}</div>
        {/await}
      </div>
      <div class="row">
        <div>OWNER STAKE</div>
        {#await validator}
          <SkeletonLoader />
        {:then validator}
          <div>{validator.ownerStake}</div>
        {/await}
      </div>
      <div class="row">
        <div>FEE (%)</div>
        {#await validator}
          <SkeletonLoader />
        {:then validator}
          <div>{formatAmount(validator.fee)}</div>
        {/await}
      </div>
      <div class="row">
        <div>APY</div>
        {#await validator}
          <SkeletonLoader />
        {:then validator}
          <div>{formatAmount(validator.apy)}</div>
        {/await}
      </div>
      <div class="row">
        <div>RECENT UPTIME</div>
        {#await validator}
          <SkeletonLoader />
        {:then validator}
          <div>{formatAmount(validator.uptime)}</div>
        {/await}
      </div>
      <div class="row">
        <div>ACCEPTS STAKE</div>
        {#await validator}
          <SkeletonLoader />
        {:then validator}
          <div>{validator.acceptsStake}</div>
        {/await}
      </div>
    </div>
  </div>
</SidePanel>

<style lang="scss">
  @use '../../../../../../../packages/ui/src/mixins.scss';

  #validator-details {
    #top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-xl);

      #bookmarked {
        justify-self: end;
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        font-weight: var(--font-weight-bold-2);
      }
    }

    #name {
      #address {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
      }
    }

    #select {
      display: flex;
      justify-content: end;
      margin-bottom: var(--spacing-xl);
    }

    #details {
      @include mixins.card();

      border: none;
      margin-top: var(--spacing-2xl);
      padding: var(--spacing-2xl) var(--spacing-xl);

      .row {
        display: grid;
        grid: 1fr / 1fr 1fr;
        align-items: center;
        gap: var(--spacing-md);
        border-bottom: var(--border);
        padding-bottom: var(--spacing-lg);
        padding-top: var(--spacing-lg);

        :nth-child(1) {
          color: var(--theme-subtext);
          font-weight: var(--font-weight-bold-2);
        }
        :nth-child(2) {
          justify-self: end;
        }
      }
    }
  }
</style>
