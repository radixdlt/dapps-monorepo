<script lang="ts">
  import { slide } from 'svelte/transition'
  import { createEventDispatcher, onMount } from 'svelte'

  type T = $$Generic
  export let transition = slide
  export let options: {
    label: string
    value: T
  }[]
  export let open = false

  let picker: HTMLElement

  onMount(() => {
    picker.addEventListener('clickoutside', () => (open = false))

    const handleClick = (event: any) => {
      if (!picker.contains(event.target)) {
        picker.dispatchEvent(new CustomEvent('clickoutside'))
      }
    }

    document.addEventListener('click', handleClick, true)

    return () => document.removeEventListener('click', handleClick, true)
  })

  const dispatchSelectedEvent = createEventDispatcher<{
    selected: (typeof options)[number]
  }>()

  let offset: number
  let width: number
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="picker" bind:clientWidth={width} bind:this={picker}>
  <div
    class="option selected"
    on:click={() => (open = !open)}
    bind:clientHeight={offset}
  >
    <slot name="selected" />
  </div>

  {#if open}
    <div
      class="drawer"
      style:padding="var(--drawer-padding)"
      style:background-color="var(--drawer-background)"
      style:border-radius="var(--drawer-border-radius)"
      style:box-shadow="var(--drawer-box-shadow)"
      style:transform={`translateY(${offset}px)`}
      style:max-height={`${offset * 5 + 10}px`}
      transition:transition
    >
      <slot name="options-header" />
      {#each options as option}
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
  .picker {
    display: flex;
    flex-direction: column;
    z-index: 1;
  }

  .drawer {
    position: absolute;
    width: 100%;
    overflow-y: auto;
  }

  .option {
    cursor: pointer;

    &.selected {
      z-index: 1;
    }
  }
</style>
