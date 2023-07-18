<script lang="ts">
  import { accounts, type Account as AccountType } from '@stores'
  import Radio from '@components/_base/radio/Radio.svelte'

  import IconNew from '@components/_base/icon/IconNew.svelte'
  import Picker from '../Picker.svelte'
  import Account from '@components/_base/account/Account.svelte'
  import AccountPickerExpandIcon from '@icons/account-picker-expand.svg'

  export let selected: AccountType | undefined = undefined

  $: options = $accounts.map((account) => ({
    label: account.label,
    value: account
  }))

  $: selected = options[0]?.value

  let open = false
</script>

<div class="account-picker">
  <Picker
    {options}
    on:selected={({ detail }) => (selected = detail.value)}
    bind:open
  >
    <div slot="selected" class="selected-wrapper">
      <div class="selected" class:open>
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
</div>

<style lang="scss">
  .account-picker :global(.picker .drawer) {
    background: var(--theme-surface-2);
    border-radius: var(--border-radius-xl);
    padding: var(--spacing-lg);
    box-shadow: var(--shadow-hover);
    margin-top: var(--spacing-lg);
  }

  .selected-wrapper {
    overflow-y: clip;
  }

  .icon {
    transition: transform 0.3s ease;
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
