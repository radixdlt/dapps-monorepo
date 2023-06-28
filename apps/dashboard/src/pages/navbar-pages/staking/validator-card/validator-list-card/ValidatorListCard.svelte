<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import ValidatorCard from '../ValidatorCard.svelte'
  import BookmarkValidator from '../../bookmark-validator/BookmarkValidator.svelte'
  export let validatorInfo: ComponentProps<ValidatorCard>['validatorInfo']
</script>

<ValidatorCard on:selected on:unselected on:click-validator {validatorInfo}>
  <svelte:fragment slot="icon" let:info>
    <BookmarkValidator validator={info} />
  </svelte:fragment>
</ValidatorCard>
