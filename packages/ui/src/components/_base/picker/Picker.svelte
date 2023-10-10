<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import RawPicker from './RawPicker.svelte'

  export let selectionText: string | undefined = undefined
  export let options: ComponentProps<RawPicker<T>>['options']
  export let open = false

  type T = $$Generic

  type $$Slots = {
    selected: {
      open: boolean
      selected: (typeof options)[number]
    }
    option: {
      option: {
        label: string
        value: T
      }
    }
  }

  type $$Events = {
    selected: {
      detail: (typeof options)[number]
    }
  }
</script>

<div class="picker">
  <RawPicker {options} on:selected bind:open>
    <div slot="selected" class="selected-wrapper" let:selected>
      <div class="selected" class:open>
        <slot name="selected" {open} {selected} />
      </div>
    </div>

    <svelte:fragment slot="options-header">
      {#if selectionText}
        <div class="options-header">{selectionText}</div>
      {/if}
    </svelte:fragment>

    <div slot="option" let:option class="option-wrapper">
      <slot name="option" {option} />
    </div>
  </RawPicker>
</div>

<style lang="scss">
  .picker :global(.picker .drawer) {
    background: var(--theme-surface-2);
    border-radius: var(--border-radius-xl);
    padding: var(--spacing-lg);
    box-shadow: var(--shadow-hover);
    margin-top: var(--spacing-lg);
  }

  .selected-wrapper {
    overflow-y: clip;
  }

  .options-header {
    font-weight: var(--font-weight-bold-3);
    font-size: var(--text-md);
    color: var(--theme-subtext);
  }

  .option-wrapper {
    margin-top: var(--spacing-lg);
    transition: opacity 300ms ease;
    &:hover {
      opacity: 50%;
    }
  }
</style>
