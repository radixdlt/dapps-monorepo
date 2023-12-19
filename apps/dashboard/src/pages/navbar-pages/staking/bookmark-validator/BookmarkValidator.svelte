<script lang="ts">
  import { connected } from '@stores'
  import SkeletonLoader from '@components/_base/skeleton-loader/SkeletonLoader.svelte'
  import { bookmarkedValidatorsStore } from '../../../../stores'
  import { setFavoriteValidator } from '../../../../server/validators/validators-api'
  import BookmarkEmptyIcon from '@icons/bookmark-empty.svg'
  import BookmarkFilledIcon from '@icons/bookmark-filled.svg'
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import type { ValidatorListItem } from '@api/utils/entities/component/validator'

  export let validator: Promise<ValidatorListItem> | ValidatorListItem
  export let withText = false

  $: promise = Promise.resolve(validator)
</script>

{#if $connected}
  {#await promise}
    <SkeletonLoader />
  {:then validator}
    <button
      class="bookmarked"
      on:click|stopPropagation={() => {
        $bookmarkedValidatorsStore[validator.address] =
          !$bookmarkedValidatorsStore[validator.address]
        bookmarkedValidatorsStore.set($bookmarkedValidatorsStore)
        setFavoriteValidator(
          validator.address,
          $bookmarkedValidatorsStore[validator.address]
        ).mapErr(() => {
          $bookmarkedValidatorsStore[validator.address] =
            !$bookmarkedValidatorsStore[validator.address]
          bookmarkedValidatorsStore.set($bookmarkedValidatorsStore)
        })
      }}
    >
      <IconNew
        icon={$bookmarkedValidatorsStore[validator.address]
          ? BookmarkFilledIcon
          : BookmarkEmptyIcon}
        size="medium"
      />
      {#if withText}<span>Bookmarked</span>{/if}
    </button>
  {/await}
{/if}

<style lang="scss">
  .bookmarked {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-weight: var(--font-weight-bold-2);
  }
</style>
