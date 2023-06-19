<script lang="ts">
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import StakeCard from './StakeCard.svelte'
  import Address from '@components/_base/address/Address.svelte'
  import type { ComponentProps } from 'svelte'
  import type { Account } from '@stores'
  import UnstakeIcon from '@icons/unstaking.svg'
  import TokenAmountCard from './token-amount-card/TokenAmountCard.svelte'
  import BigNumber from 'bignumber.js'
  import { formatTokenValue } from '@utils'

  export let amountToUnstake: string = '0'
  export let validator: {
    name: string
    address: string
  }
  export let tokenCardProps: Omit<
    ComponentProps<TokenAmountCard>,
    'amount' | 'tokenDisplayedAmount' | 'invalid' | 'disabled'
  >
  export let invalid: boolean
  export let account: Account
  export let stakedAmount: string

  let validUnstakeAmount: boolean

  $: validUnstakeAmount = new BigNumber(stakedAmount).gte(
    new BigNumber(amountToUnstake)
  )

  $: invalid = !validUnstakeAmount
</script>

<StakeCard>
  <svelte:fragment slot="icon">
    <IconNew icon={UnstakeIcon} --size="4rem" />
  </svelte:fragment>

  <div class="info" slot="info">
    <div class="validator-name dotted-overflow">
      {validator.name}
    </div>

    <Address value={validator.address} short useBackground={false} />
  </div>

  <svelte:fragment slot="token-amount-card">
    <TokenAmountCard
      {...tokenCardProps}
      {account}
      bind:tokenAmount={amountToUnstake}
      bind:invalid
    >
      <div slot="footer" class="subtext" class:invalid>
        Staked {formatTokenValue(stakedAmount).value}
      </div>
    </TokenAmountCard>
  </svelte:fragment>
</StakeCard>

<style lang="scss">
  @use '../../../../../../../../packages/ui/src/mixins.scss';

  .validator-name {
    font-size: var(--text-lg);
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .invalid {
    color: var(--invalid-border-color);
  }
</style>
