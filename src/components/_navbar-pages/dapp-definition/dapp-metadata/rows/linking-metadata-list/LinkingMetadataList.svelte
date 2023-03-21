<script lang="ts">
  import Input from '@components/_base/input/Input.svelte'
  import Popover from '@components/_base/popover/Popover.svelte'

  type Validation = $$Generic

  export let input: string
  export let disabled: boolean
  export let placeholder: string
  export let showPopover: boolean
  export let popoverStatus: 'error' | 'success'
</script>

<Popover
  type={popoverStatus}
  placement="right"
  margin={30}
  bind:show={showPopover}
>
  <div>
    <div class="input">
      <Input on:input {disabled} type="text" bind:value={input} {placeholder} />
    </div>
  </div>

  <slot slot="content" />
</Popover>

<style>
  .input {
    width: var(--sizes-5xl);
  }
</style>
