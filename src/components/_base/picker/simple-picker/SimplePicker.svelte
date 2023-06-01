<script lang="ts">
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import Picker from '../Picker.svelte'

  type T = $$Generic

  export let selected: typeof options[number]
  export let options: {
    label: string
    value: T
  }[]
  export let open = false
</script>

<div id="simple-picker">
  <Picker
    {options}
    on:selected={({ detail }) => (selected = detail)}
    bind:open
    --drawer-background="var(--color-light)"
    --drawer-border-radius="0 0 var(--border-radius-lg) var(--border-radius-lg)"
  >
    <button slot="selected" class="selected option">
      {selected.label}
      <div id="icon" style:transform={`rotate(${open ? '180deg' : 0})`}>
        <IconNew type="pickerExpand" size="small" />
      </div>
    </button>

    <div slot="option" let:option class="option-background">
      <button class="option">
        {option.label}
        {#if option === selected}
          <IconNew type="selectedOption" size="small" />
        {/if}
      </button>
    </div>
  </Picker>
</div>

<style lang="scss">
  #simple-picker {
    border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
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
