<script lang="ts">
  import SidePanel from '@components/_base/side-panel/SidePanel.svelte'
  import { context, type Validator } from '../Validators.svelte'
  import { formatAmount, shortenAddress } from '@utils'
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import ExtendedStakingCard from './ExtendedStakingCard.svelte'
  import Checkbox from '@components/_base/checkbox/Checkbox.svelte'

  export let open: boolean
  export let validator: Validator

  const selected = context.get('selectedValidators')
  const connected = context.get('connected')
  const bookmarked = context.get('bookmarkedValidators')
</script>

<SidePanel bind:open --max-width="80rem" --min-width="70rem">
  <div id="validator-details">
    <div id="top-row" class="divider">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div id="close" on:click={() => (open = false)}>
        <IconNew type="close" size="small" />
        <div>Close</div>
      </div>
      <div id="validator-title">Validator</div>
      {#if $connected}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          id="bookmarked"
          on:click={() => {
            $bookmarked[validator.address] = !$bookmarked[validator.address]
            $bookmarked = $bookmarked
          }}
        >
          <IconNew
            type={$bookmarked[validator.address]
              ? 'bookmarkFilled'
              : 'bookmarkEmpty'}
            size="medium"
          />
          Bookmarked
        </div>
      {/if}
    </div>
    <div id="name">
      <div>
        {validator.name}
      </div>
      <a id="address">
        {shortenAddress(validator.address)}
        <IconNew type="copy" size="medium" />
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
      <div class="divider">
        <ExtendedStakingCard
          staked={validator.accumulatedStaked}
          unstaking={validator.accumulatedUnstaking}
          readyToClaim={validator.accumulatedReadyToClaim}
          claimText="Claim"
        />
      </div>
    {/if}

    <div id="details">
      <div id="title">Validator Details</div>
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
  @use '../../../../mixins.scss';
  .divider {
    border-bottom: var(--border);
    padding-bottom: var(--spacing-2xl);
  }

  #validator-details {
    padding: var(--spacing-2xl) var(--spacing-3xl);

    #top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-xl);

      #validator-title {
        font-size: var(--text-lg);
        font-weight: var(--font-weight-bold-2);
      }

      #close {
        cursor: pointer;
        justify-self: start;

        display: flex;
        align-items: center;
        gap: var(--spacing-sm);

        :nth-child(2) {
          color: var(--color-radix-blue-2);
        }
      }

      #bookmarked {
        justify-self: end;
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        cursor: pointer;
        font-weight: var(--font-weight-bold-2);
      }
    }

    #name {
      div {
        font-size: var(--text-2xl);
        font-weight: var(--font-weight-bold-2);
      }

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
      @include mixins.card(false);

      margin-top: var(--spacing-2xl);
      padding: var(--spacing-2xl) var(--spacing-xl);
      #title {
        font-size: var(--text-lg);
        font-weight: var(--font-weight-bold-2);
        margin-bottom: var(--spacing-lg);
      }

      .row {
        display: grid;
        grid: 1fr / 1fr 1fr;
        align-items: center;
        gap: var(--spacing-md);
        border-bottom: var(--border);
        padding-bottom: var(--spacing-lg);
        padding-top: var(--spacing-lg);

        :nth-child(1) {
          color: var(--color-grey-2);
          font-weight: var(--font-weight-bold-2);
        }
        :nth-child(2) {
          justify-self: end;
        }
      }
    }
  }
</style>
