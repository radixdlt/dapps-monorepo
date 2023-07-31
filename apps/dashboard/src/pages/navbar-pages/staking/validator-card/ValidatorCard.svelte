<script lang="ts">
  import StakeDisplay from './StakeDisplay.svelte'
  import Address from '@components/_base/address/Address.svelte'
  import { createEventDispatcher } from 'svelte'
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import { truncateNumber } from '@utils'
  import SelectValidator from '../select-validator/SelectValidator.svelte'
  import AcceptsStake from '../accepts-stake/AcceptsStake.svelte'
  import type { Validator } from '../Validators.svelte'
  import ApyBox from '../validator-list/ApyBox.svelte'

  export let validatorInfo: Promise<Validator>
  export let columnWidths: number[] = []

  const dispatch = createEventDispatcher<{
    'click-validator': string
  }>()
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<button
  class="validator-card validator-card-grid"
  on:click={() =>
    validatorInfo.then((info) => dispatch('click-validator', info.address))}
>
  <div class="icon" bind:clientWidth={columnWidths[0]}>
    {#await validatorInfo then info}
      <slot name="icon" {info} />
    {/await}
  </div>

  <div class="name" bind:clientWidth={columnWidths[1]}>
    {#await validatorInfo}
      <SkeletonLoader width={200} />
    {:then { name }}
      {name}
    {/await}
  </div>

  <div class="address" bind:clientWidth={columnWidths[2]}>
    {#await validatorInfo}
      <SkeletonLoader width={80} />
    {:then { address }}
      <Address short value={address} --background="var(--theme-surface-1)" />
    {/await}
  </div>

  <div
    class="info-column"
    style:min-width="6 rem"
    bind:clientWidth={columnWidths[3]}
  >
    <StakeDisplay stakeInfo={validatorInfo} />
  </div>

  <div class="info-column" bind:clientWidth={columnWidths[4]}>
    {#await validatorInfo}
      <SkeletonLoader width={30} />
    {:then { percentageOwnerStake }}
      {truncateNumber(percentageOwnerStake)}%
    {/await}
  </div>

  <div class="info-column">
    <ApyBox
      apyInfo={validatorInfo}
      bind:apyWidth={columnWidths[5]}
      bind:feeWidth={columnWidths[6]}
      bind:uptimeWidth={columnWidths[7]}
    />
  </div>

  <div
    class="info-column"
    style:line-height="0"
    bind:clientWidth={columnWidths[8]}
  >
    <AcceptsStake
      value={validatorInfo.then(({ acceptsStake }) => acceptsStake)}
    />
  </div>

  <div
    class="info-column last-column"
    style:min-width="10rem"
    bind:clientWidth={columnWidths[9]}
  >
    <SelectValidator validator={validatorInfo} text="SELECT" />
  </div>
</button>

<style lang="scss">
  @use '../../../../../../../packages/ui/src/mixins.scss';
  .validator-card {
    @include mixins.card;
    align-items: center;
    transition: var(--transition-hover-card);
    height: 5rem;
    background: var(--theme-surface-2);

    &:hover {
      transform: var(--transform-hover-card);
      box-shadow: var(--shadow-hover);
    }
  }

  .icon {
    height: 80%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: var(--border-divider) var(--theme-border);
  }
  .name {
    font-weight: var(--font-weight-bold-2);
    padding-left: var(--spacing-md);
  }

  .address {
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

  .validator-card-grid {
    display: grid;
    grid: var(--column-grid);
    min-width: 75rem;
  }

  .card-list {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
</style>
