<script lang="ts">
  import SidePanel from '@components/_base/side-panel/SidePanel.svelte'
  import { context, type Validator } from '../Validators.svelte'
  import { formatAmount, shortenAddress } from '@utils'
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import ExtendedStakingCard from './ExtendedStakingCard.svelte'
  import Checkbox from '@components/_base/checkbox/Checkbox.svelte'
  import Divider from '@components/_base/divider/Divider.svelte'
  import CloseButton from '@components/_base/side-panel/CloseButton.svelte'
  import CopyIcon from '@icons/copy.svg'
  import BookmarkEmptyIcon from '@icons/bookmark-empty.svg'
  import BookmarkFilledIcon from '@icons/bookmark-filled.svg'

  export let open: boolean
  export let validator: Validator

  const selected = context.get('selectedValidators')
  const connected = context.get('connected')
  const bookmarked = context.get('bookmarkedValidators')
</script>

<SidePanel bind:open>
  <div id="validator-details">
    <div id="top-row">
      <CloseButton on:click={() => (open = false)} />
      <h3>Validator</h3>
      {#if $connected}
        <button
          id="bookmarked"
          on:click={() => {
            $bookmarked[validator.address] = !$bookmarked[validator.address]
            $bookmarked = $bookmarked
          }}
        >
          <IconNew
            icon={$bookmarked[validator.address]
              ? BookmarkFilledIcon
              : BookmarkEmptyIcon}
            size="medium"
          />
          Bookmarked
        </button>
      {/if}
    </div>
    <Divider />
    <div id="name">
      <h2>
        {validator.name}
      </h2>
      <a id="address">
        {shortenAddress(validator.address)}
        <IconNew icon={CopyIcon} size="medium" />
      </a>
    </div>

    <div id="select">
      {#if $connected}
        <Checkbox
          bind:checked={$selected[validator.address]}
          on:checked={() => {
            $selected = $selected
          }}
          on:unchecked={() => {
            $selected = $selected
          }}
          --label-color="var(--color-grey-2)"
        >
          SELECT VALIDATOR
        </Checkbox>
      {/if}
    </div>

    {#if $connected}
      <div>
        <ExtendedStakingCard
          staked={validator.accumulatedStaked}
          unstaking={validator.accumulatedUnstaking}
          readyToClaim={validator.accumulatedReadyToClaim}
          claimText="Claim"
        />
      </div>
      <Divider />
    {/if}

    <div id="details">
      <h3>Validator Details</h3>
      <div class="row">
        <div>ADDRESS</div>
        <a>
          {shortenAddress(validator.address)}
        </a>
      </div>
      <div class="row">
        <div>OWNER ADDRESS</div>
        <a>{validator.ownerAddress}</a>
      </div>
      <div class="row">
        <div>WEBSITE</div>
        <a>{validator.website}</a>
      </div>
      <div class="row">
        <div>TOTAL STAKE</div>
        <div>{validator.totalStake}</div>
      </div>
      <div class="row">
        <div>OWNER STAKE</div>
        <div>{validator.ownerStake}</div>
      </div>
      <div class="row">
        <div>FEE (%)</div>
        <div>{formatAmount(validator.fee)}</div>
      </div>
      <div class="row">
        <div>APY</div>
        <div>{formatAmount(validator.apy)}</div>
      </div>
      <div class="row">
        <div>RECENT UPTIME</div>
        <div>{formatAmount(validator.uptime)}</div>
      </div>
      <div class="row">
        <div>ACCEPTS STAKE</div>
        <div>{validator.acceptsStake}</div>
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
