<script lang="ts">
  import { slide } from 'svelte/transition'
  import { createEventDispatcher, onMount } from 'svelte'

  type T = $$Generic

  export let options: {
    label: string
    value: T
  }[]
  export let open = false

  onMount(() => {
    const picker = document.getElementById('picker')

    if (picker) {
      picker.addEventListener('clickoutside', () => (open = false))

      const handleClick = (event: any) => {
        if (!picker.contains(event.target)) {
          picker.dispatchEvent(new CustomEvent('clickoutside'))
        }
      }

      document.addEventListener('click', handleClick, true)

      return () => document.removeEventListener('click', handleClick, true)
    }
  })

  const dispatchSelectedEvent = createEventDispatcher<{
    selected: typeof options[number]
  }>()
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id="picker">
  <div class="option" on:click={() => (open = !open)}>
    <slot name="selected" />
  </div>
  {#if open}
    {#each options as option}
      <div
        class="option"
        transition:slide
        on:click={() => dispatchSelectedEvent('selected', option)}
      >
        <slot name="option" {option} />
      </div>
    {/each}
  {/if}
</div>

<style lang="scss">
  #picker {
    display: flex;
    flex-direction: column;
  }

  .option {
    cursor: pointer;
  }
</style>
