<script lang="ts">
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import Picker from '../Picker.svelte'
  import PickerExpandIcon from '@icons/picker-expand.svg'
  import SelectedOptionIcon from '@icons/selected-option.svg'

  type T = $$Generic

  export let selected: (typeof options)[number]
  export let options: {
    label: string
    value: T
  }[]
  export let open = false
</script>

<div
  id="simple-picker"
  style:border-radius={open
    ? 'var(--border-radius-lg) var(--border-radius-lg) 0 0'
    : 'var(--border-radius-lg)'}
>
  <Picker {options} on:selected={({ detail }) => (selected = detail)} bind:open>
    <button slot="selected" class="selected option">
      {selected.label}
      <div id="icon" style:transform={`rotate(${open ? '180deg' : 0})`}>
        <IconNew icon={PickerExpandIcon} size="small" />
      </div>
    </button>

    <div slot="option" let:option class="option-background">
      <button class="option">
        {option.label}
        {#if option === selected}
          <IconNew icon={SelectedOptionIcon} size="small" />
        {/if}
      </button>
    </div>
  </Picker>
</div>

<style lang="scss">
  #simple-picker :global(.picker .drawer) {
    background: var(--color-light);
    border-radius: 0 0 var(--border-radius-lg) var(--border-radius-lg);
  }
  #simple-picker {
    border-radius: var(--border-radius-lg);
    width: fit-content;
    background-color: var(--color-light);
  }
  .selected {
    background-color: var(--color-grey-4);
    border: var(--border-strong);
    display: flex;
    gap: var(--spacing-md);
    justify-content: space-between;
    align-items: center;
  }

  .option {
    margin: var(--spacing-md);
    padding: var(--spacing-md);
    border-radius: var(--border-radius-lg);
    cursor: pointer;
    width: var(--width, 15rem);
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:hover {
      background-color: var(--color-grey-4);
      transition: background-color 0.2s ease-in-out;
    }
  }

  #icon {
    transition: transform 0.3s ease;
  }
</style>
