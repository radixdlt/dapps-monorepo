<script lang="ts">
  import { accounts, type Account as AccountType } from '@stores'
  import Radio from '@components/_base/radio/Radio.svelte'

  import IconNew from '@components/_base/icon/IconNew.svelte'
  import Picker from '../Picker.svelte'
  import Account from '@components/_base/account/Account.svelte'
  import { slide, type TransitionConfig } from 'svelte/transition'
  import AccountPickerExpandIcon from '@icons/account-picker-expand.svg'

  export let selected: AccountType | undefined

  function slidePicker(node: Element): TransitionConfig {
    const slideTransition = slide(node)

    const offset = 60 // height of "selected" div when picker is opened
    const safetyPadding = 8 // sliding needs to stop before the rounded corners start

    return {
      ...slideTransition,
      css: (t, u) =>
        slideTransition.css?.(t, u) +
        `transform: translateY(${
          t * offset < safetyPadding ? safetyPadding : t * offset
        }px)`
    }
  }

  $: options = $accounts.map((account) => ({
    label: account.label,
    value: account
  }))

  $: selected = options[0]?.value

  let open = false
</script>

<Picker
  {options}
  transition={slidePicker}
  on:selected={({ detail }) => (selected = detail.value)}
  bind:open
  --drawer-background="#fff"
  --drawer-border-radius="0 0 var(--border-radius-xl) var(--border-radius-xl)"
  --drawer-padding="0 10px 10px"
  --drawer-box-shadow="var(--shadow)"
>
  <div slot="selected" class="selected-wrapper">
    <div class="{open ? 'open' : ''} selected">
      <Account account={selected}>
        <div class="icon" style:transform={`rotate(${open ? '-180deg' : 0})`}>
          <IconNew icon={AccountPickerExpandIcon} size="small" />
        </div>
      </Account>
    </div>
  </div>

  <div class="options-header" slot="options-header">Select account</div>

  <div slot="option" let:option class="option-wrapper">
    <Account account={option.value}>
      <Radio selected={option.value === selected} />
    </Account>
  </div>
</Picker>

<style lang="scss">
  .selected-wrapper {
    overflow-y: clip;
  }

  .selected {
    transition: padding 300ms ease, border-radius 300ms ease;
    background: #fff;
    border-radius: var(--border-radius-xl);
    height: 60px;

    &.open {
      padding: 10px;
      border-radius: var(--border-radius-xl) var(--border-radius-xl) 0 0;
      box-shadow: var(--shadow);
    }
  }

  .icon {
    transition: transform 0.3s ease;
  }

  .options-header {
    font-weight: 700;
    font-size: 18px;
    color: #8a8fa4;
    margin-top: 15px;
  }

  .option-wrapper {
    margin-top: 15px;
    transition: opacity 300ms ease;
    &:hover {
      opacity: 50%;
    }
  }
</style>
