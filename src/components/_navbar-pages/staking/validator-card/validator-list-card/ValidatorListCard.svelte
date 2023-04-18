<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import Icon from '@components/_base/icon/IconNew.svelte'
  import ValidatorCard from '../ValidatorCard.svelte'

  export let validatorInfo: ComponentProps<ValidatorCard>['validatorInfo']

  let bookmarked: boolean
</script>

<ValidatorCard {validatorInfo}>
  <div
    slot="icon"
    class="bookmark"
    on:click={() => {
      bookmarked = !bookmarked
    }}
  >
    <Icon size="small" type={bookmarked ? 'bookmarkFilled' : 'bookmarkEmpty'} />
  </div>
</ValidatorCard>
