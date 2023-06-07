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

  let offset: number
  let width: number
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id="picker" bind:clientWidth={width}>
  <div
    class="option"
    on:click={() => (open = !open)}
    bind:clientHeight={offset}
  >
    <slot name="selected" />
  </div>

  {#if open}
    <div
      id="drawer"
      style:padding="var(--drawer-padding)"
      style:background-color="var(--drawer-background)"
      style:border-radius="var(--drawer-border-radius)"
      style:transform={`translateY(${offset}px)`}
      transition:slide
    >
      <slot name="options-header"></slot>
      {#each options as option, i}
        <div
          class="option"
          on:click={() => {
            dispatchSelectedEvent('selected', option)
            open = false
          }}
        >
          <slot name="option" {option} />
        </div>
      {/each}
    </div>
  {/if}
</div>

<style lang="scss">
  #picker {
    display: flex;
    flex-direction: column;
  }

  #drawer {
    position: absolute;
    width: 100%;
  }

  .option {
    cursor: pointer;
  }
</style>
