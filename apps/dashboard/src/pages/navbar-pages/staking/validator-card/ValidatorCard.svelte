<script lang="ts">
  import StakeDisplay from './StakeDisplay.svelte'
  import ApyBox from './ApyBox.svelte'
  import Address from './Address.svelte'
  import { createEventDispatcher } from 'svelte'
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import { truncateNumber } from '@utils'
  import SelectValidator from '../select-validator/SelectValidator.svelte'
  import AcceptsStake from '../accepts-stake/AcceptsStake.svelte'
  import type { Validator } from '../Validators.svelte'

  export let validatorInfo: Promise<Validator>

  const dispatch = createEventDispatcher<{
    'click-validator': string
  }>()
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<button
  id="validator-card"
  class="validator-card-grid"
  on:click|self={() =>
    validatorInfo.then((info) => dispatch('click-validator', info.address))}
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
    <AcceptsStake
      value={validatorInfo.then(({ acceptsStake }) => acceptsStake)}
    />
  </div>

  <div class="info-column last-column" style:min-width="10rem">
    <SelectValidator validator={validatorInfo} text="SELECT" />
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
