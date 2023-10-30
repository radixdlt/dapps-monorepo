<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import IconNew from '../icon/IconNew.svelte'
  import DatePickerIcon from './DatepickerIcon.svg'

  export let value = ''
  export let format = 'DD/MM/YYYY'

  const dispatch = createEventDispatcher()
</script>

<div class="wrapper">
  <input
    type="text"
    placeholder={format.toLocaleLowerCase()}
    bind:value
    on:change
  />
  <button
    class="icon"
    on:click={() => {
      dispatch('open-calendar')
    }}
  >
    <IconNew icon={DatePickerIcon} --size="20px" />
  </button>
</div>

<style lang="scss">
  .wrapper {
    display: flex;
    gap: 10px;

    input {
      width: 73px;
      ::placeholder {
        letter-spacing: -0.5px;
      }
    }

    .icon {
      cursor: pointer;
    }
  }
</style>
