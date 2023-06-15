<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import Icon from '@components/_base/icon/IconNew.svelte'
  import ValidatorCard from '../ValidatorCard.svelte'
  import { context } from '../../Validators.svelte'
  import BookmarkFilledIcon from '@icons/bookmark-filled.svg'
  import BookmarkEmptyIcon from '@icons/bookmark-empty.svg'

  export let validatorInfo: ComponentProps<ValidatorCard>['validatorInfo']

  const connected = context.get('connected')
  const bookmarked = context.get('bookmarkedValidators')
</script>

<ValidatorCard on:selected on:unselected on:click-validator {validatorInfo}>
  <button
    slot="icon"
    let:info
    on:click={() => {
      $bookmarked[info.address] = !$bookmarked[info.address]
      $bookmarked = $bookmarked
    }}
  >
    {#if $connected}
      <Icon
        size="medium"
        icon={$bookmarked[info.address]
          ? BookmarkFilledIcon
          : BookmarkEmptyIcon}
      />
    {/if}
  </button>
</ValidatorCard>
