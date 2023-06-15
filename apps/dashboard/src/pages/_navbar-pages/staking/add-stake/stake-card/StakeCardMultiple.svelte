<script lang="ts">
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import StakeCard from './StakeCard.svelte'
  import ValidatorInfo from './ValidatorInfo.svelte'
  import TokenAmountCard from './token-amount-card/TokenAmountCard.svelte'
  import { createEventDispatcher, type ComponentProps } from 'svelte'
  import type { Validator } from '../../Validators.svelte'
  import TrashIcon from '@icons/trash.svg'

  export let rightColumnWidth: string
  export let validator: Validator
  export let tokenInfo: Omit<
    ComponentProps<TokenAmountCard>,
    'invalid' | 'tokenAmount' | 'tokenDisplayedAmount'
  >
  export let tokenAmount: string = '0'
  export let tokenDisplayedAmount: string = '0'
  export let amountCardDisabled = false
  export let currentlyStakingAmount: string

  const dispatchRemoveEvent = createEventDispatcher<{
    remove: { validator: string }
  }>()
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<StakeCard --token-amount-card-width={rightColumnWidth} --shadow="none">
  <div
    slot="icon"
    class="remove-icon"
    on:click={() =>
      dispatchRemoveEvent('remove', { validator: validator.address })}
  >
    <IconNew icon={TrashIcon} --size="1rem" faded />
    <div class="subtext">Remove</div>
  </div>

  <svelte:fragment slot="info">
    <ValidatorInfo
      validatorName={validator.name}
      validatorAddress={validator.address}
      {currentlyStakingAmount}
    />
  </svelte:fragment>

  <svelte:fragment slot="token-amount-card">
    <TokenAmountCard
      {...tokenInfo}
      invalid={false}
      bind:tokenAmount
      bind:tokenDisplayedAmount
      bind:disabled={amountCardDisabled}
    />
  </svelte:fragment>
</StakeCard>

<style lang="scss">
  @use '../../../../../../../../packages/ui/src/mixins.scss';

  .remove-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
