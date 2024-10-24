<script lang="ts">
  import SimplePicker from '@components/_base/picker/simple-picker/SimplePicker.svelte'
  import FilterCard from './FilterCard.svelte'
  import ButtonNew from '@components/_base/button/ButtonNew.svelte'

  export let title: string
  export let description: string
  export let options: { label: string; value: string }[] = []
  export let selected: { label: string; value: string } | undefined
</script>

<FilterCard {title} {description}>
  <div class="picker">
    <SimplePicker bind:selected {options} />
  </div>
  <ButtonNew
    on:click={() => {
      selected = undefined
    }}>Clear</ButtonNew
  >
</FilterCard>

<style>
  .picker {
    margin: var(--spacing-xl) 0;
  }
</style>
