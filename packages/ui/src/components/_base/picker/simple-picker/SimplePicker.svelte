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
  export let selectionText: string | undefined = undefined
</script>

<Picker
  {options}
  {selectionText}
  on:selected={(e) => {
    selected = e.detail
  }}
  bind:open
>
  <button slot="selected" class="selected option" let:selected>
    {selected.label}
    <div class="icon" style:transform={`rotate(${open ? '180deg' : 0})`}>
      <IconNew icon={PickerExpandIcon} size="small" />
    </div>
  </button>

  <div slot="option" let:option class="option-background">
    <button class="option">
      {option.label}
      {#if option.value === selected.value}
        <IconNew icon={SelectedOptionIcon} size="small" />
      {/if}
    </button>
  </div>
</Picker>

<style lang="scss">
  .selected {
    width: 100%;
    background-color: var(--color-grey-4);
  }

  .option {
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: var(--border-radius-lg);
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    &:hover {
      background-color: var(--color-grey-4);
      transition: background-color 0.2s ease-in-out;
    }
  }

  .icon {
    transition: transform 0.3s ease;
  }
</style>
