<script lang="ts">
  import Checkbox from '@components/_base/checkbox/Checkbox.svelte'
  import { selectedValidators } from '../Validators.svelte'
  import { connected } from '@stores'
  import type { ValidatorListItem } from '@api/utils/entities/component/validator'
  import { track } from '@dashboard/routes/+layout.svelte'

  export let text: string
  export let validator: Promise<ValidatorListItem>
</script>

{#if $connected}
  {#await validator then validator}
    <Checkbox
      bind:checked={$selectedValidators[validator.address]}
      on:checked={() => {
        track('click:select-validator')
        $selectedValidators = $selectedValidators
      }}
      on:unchecked={() => {
        $selectedValidators = $selectedValidators
      }}
      disabled={!validator.acceptsStake}
      --label-color="var(--theme-subtext)"
    >
      {text}
    </Checkbox>
  {/await}
{/if}
