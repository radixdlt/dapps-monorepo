<script lang="ts">
  import Checkbox from '@svelte-ui/components/_base/checkbox/Checkbox.svelte'
  import { selectedValidators } from '../Validators.svelte'
  import { connected } from '@svelte-ui/stores'
  import type { ValidatorListItem } from '@common/api/utils/entities/component/validator'

  export let text: string
  export let validator: Promise<ValidatorListItem>
</script>

{#if $connected}
  {#await validator then validator}
    <Checkbox
      bind:checked={$selectedValidators[validator.address]}
      on:checked={() => {
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
