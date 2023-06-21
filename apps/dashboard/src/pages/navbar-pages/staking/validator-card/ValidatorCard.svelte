<script lang="ts">
  import Icon from '@components/_base/icon/IconNew.svelte'
  import StakeDisplay from './StakeDisplay.svelte'
  import ApyBox from './ApyBox.svelte'
  import Address from './Address.svelte'
  import { createEventDispatcher } from 'svelte'
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import { truncateNumber } from '@utils'
  import { context, type Validator } from '../Validators.svelte'
  import Checkbox from '@components/_base/checkbox/Checkbox.svelte'
  import CheckMarkIcon from '@icons/checkmark.svg'
  import CrossIcon from '@icons/cross.svg'

  export let validatorInfo: Promise<Validator>

  const dispatch = createEventDispatcher<{
    'click-validator': Awaited<typeof validatorInfo>
  }>()

  const selected = context.get('selectedValidators')
  let connected = context.get('connected')
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<button
  id="validator-card"
  class="validator-card-grid"
  on:click|self={() =>
    validatorInfo.then((info) => dispatch('click-validator', info))}
>
  <div id="icon">
    {#await validatorInfo then info}
      <slot name="icon" {info} />
    {/await}
  </div>

  <div id="name">
    {#await validatorInfo}
      <SkeletonLoader width={200} />
    {:then { name }}
      {name}
    {/await}
  </div>

  <div id="address">
    {#await validatorInfo}
      <SkeletonLoader width={80} />
    {:then { address }}
      <Address {address} />
    {/await}
  </div>

  <div class="info-column" style:min-width="6 rem">
    <StakeDisplay stakeInfo={validatorInfo} />
  </div>

  <div class="info-column">
    {#await validatorInfo}
      <SkeletonLoader width={30} />
    {:then { percentageOwnerStake }}
      {truncateNumber(percentageOwnerStake)}%
    {/await}
  </div>

  <div class="info-column">
    <ApyBox apyInfo={validatorInfo} />
  </div>

  <div class="info-column" style:line-height="0">
    {#await validatorInfo}
      <SkeletonLoader width={20} />
    {:then { acceptsStake }}
      {#if acceptsStake}
        <Icon size="medium" icon={CheckMarkIcon} />
      {:else}
        <div style:color="var(--color-alert)">
          <Icon size="medium" icon={CrossIcon} />
        </div>
      {/if}
    {/await}
  </div>

  <div class="info-column last-column" style:min-width="10rem">
    {#await validatorInfo then info}
      {#if $connected}
        <Checkbox
          bind:checked={$selected[info.address]}
          on:checked={() => {
            $selected = $selected
          }}
          on:unchecked={() => {
            $selected = $selected
          }}
          --label-color="var(--color-grey-2)"
        >
          SELECT
        </Checkbox>
      {/if}
    {/await}
  </div>
</button>

<style lang="scss">
  @use '../shared.scss';
  @use '../../../../../../../packages/ui/src/mixins.scss';
  #validator-card {
    @include mixins.card;
    align-items: center;
    transition: var(--transition-hover-card);
    height: 5rem;
    background: var(--theme-surface-2);
  }

  #validator-card:hover {
    transform: var(--transform-hover-card);
    box-shadow: var(--shadow-hover);
  }

  #icon {
    height: 80%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: var(--border-divider) var(--theme-border);
  }
  #name {
    font-weight: var(--font-weight-bold-2);
    padding-left: var(--spacing-md);
  }

  #address {
    height: 80%;
    width: 100%;
    display: flex;
    justify-self: center;
    align-items: center;
    justify-content: end;
    border-right: var(--border-divider) var(--theme-border);
    padding-right: var(--spacing-md);
  }

  .info-column {
    padding: 0 2rem;
    justify-self: center;
  }

  .last-column {
    justify-content: end;
    padding-right: 0;
  }
</style>
