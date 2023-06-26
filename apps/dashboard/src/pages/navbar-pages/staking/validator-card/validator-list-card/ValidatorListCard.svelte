<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import Icon from '@components/_base/icon/IconNew.svelte'
  import ValidatorCard from '../ValidatorCard.svelte'
  import BookmarkFilledIcon from '@icons/bookmark-filled.svg'
  import BookmarkEmptyIcon from '@icons/bookmark-empty.svg'
  import { connected } from '@stores'
  import { context } from '../../Validators.svelte'
  import { setFavoriteValidator } from '../../../../../server/validators/validators-api'
  export let validatorInfo: ComponentProps<ValidatorCard>['validatorInfo']

  const bookmarked = context.get('bookmarkedValidators')
</script>

<ValidatorCard on:selected on:unselected on:click-validator {validatorInfo}>
  <svelte:fragment slot="icon" let:info>
    {#if $connected}
      <button
        on:click={() => {
          $bookmarked[info.address] = !$bookmarked[info.address]
          bookmarked.set($bookmarked)
          setFavoriteValidator(info.address, $bookmarked[info.address]).mapErr(
            () => {
              $bookmarked[info.address] = !$bookmarked[info.address]
              bookmarked.set($bookmarked)
            }
          )
        }}
      >
        <Icon
          size="medium"
          icon={$bookmarked[info.address]
            ? BookmarkFilledIcon
            : BookmarkEmptyIcon}
        />
      </button>
    {/if}
  </svelte:fragment>
</ValidatorCard>
