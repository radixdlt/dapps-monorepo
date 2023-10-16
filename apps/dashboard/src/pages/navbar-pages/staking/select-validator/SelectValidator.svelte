<script lang="ts">
  import Checkbox from '@components/_base/checkbox/Checkbox.svelte'
  import { selectedValidators } from '../Validators.svelte'
  import { connected } from '@stores'
  import type { Validator } from '@api/utils/entities/validator'

  export let text: string
  export let validator: Promise<Validator>
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
