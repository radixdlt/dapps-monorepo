<script lang="ts">
  import Checkbox from '@components/_base/checkbox/Checkbox.svelte'
  import { selectedValidators, type Validator } from '../Validators.svelte'

  import { connected } from '@stores'
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
      --label-color="var(--color-grey-2)"
    >
      {text}
    </Checkbox>
  {/await}
{/if}
