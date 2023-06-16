<script lang="ts">
  import BigNumber from 'bignumber.js'
  import TokenAmountCardWithUndertext from './TokenAmountCardWithUndertext.svelte'
  import { formatTokenValue } from '@utils/format-amount'

  export let token: {
    name: string
    iconUrl: string
  }
  export let tokenDisplayedAmount: string = ''
  export let tokenBalance: string
  export let tokenAmount: string
  export let invalid = false
  export let disabled = false

  $: hasEnoughBalance = new BigNumber(tokenBalance).gte(
    new BigNumber(tokenAmount)
  )

  $: invalid = !hasEnoughBalance
</script>

<TokenAmountCardWithUndertext
  {token}
  bind:tokenDisplayedAmount
  bind:invalid
  bind:disabled
  bind:tokenAmount
>
  <div
    style:color={!hasEnoughBalance ? 'var(--invalid-border-color)' : ''}
    class="subtext"
    slot="undertext"
  >
    Balance {formatTokenValue(tokenBalance)}
  </div>
</TokenAmountCardWithUndertext>

<style lang="scss">
  @use '../../../../../../../../../packages/ui/src/mixins.scss';
</style>
