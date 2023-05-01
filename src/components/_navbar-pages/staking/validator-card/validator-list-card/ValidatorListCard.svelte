<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import Icon from '@components/_base/icon/IconNew.svelte'
  import ValidatorCard from '../ValidatorCard.svelte'
  import { context } from '../../Validators.svelte'

  export let validatorInfo: ComponentProps<ValidatorCard>['validatorInfo']

  let bookmarked: boolean

  let connected = context.get('connected')
</script>

<ValidatorCard {validatorInfo}>
  <div
    slot="icon"
    class="bookmark"
    on:click={() => {
      bookmarked = !bookmarked
    }}
  >
    {#if $connected}
      <Icon
        size="medium"
        type={bookmarked ? 'bookmarkFilled' : 'bookmarkEmpty'}
      />
    {/if}
  </div>
</ValidatorCard>
