<script lang="ts">
  import { accounts, type Account as AccountType } from '@stores'
  import Radio from '@components/_base/radio/Radio.svelte'

  import IconNew from '@components/_base/icon/IconNew.svelte'
  import Picker from '../Picker.svelte'
  import Account from '@components/_base/account/Account.svelte'

  export let selected: AccountType
  const options = $accounts.map((account) => ({
    label: account.label,
    value: account
  }))
  let open = false
</script>

<Picker
  {options}
  on:selected={({ detail }) => (selected = detail.value)}
  bind:open
  --drawer-background="#fff"
  --drawer-border-radius="0 0 12px 12px"
  --drawer-padding="0 12px 12px"
>
  <div slot="selected" class="{open ? 'selected-open' : ''} selected">
    <Account account={selected}>
      <div class="icon" style:transform={`rotate(${open ? '-180deg' : 0})`}>
        <IconNew type="accountPickerExpand" size="small" />
      </div>
    </Account>
  </div>

  <span class="options-header" slot="options-header">Select account</span>

  <div slot="option" let:option class="option-wrapper">
    <Account account={option.value}>
      <Radio selected={option.value === selected} />
    </Account>
  </div>
</Picker>

<style lang="scss">
  .selected {
    transition: padding 300ms ease;
    background: #fff;
    border-radius: 12px;
  }
  .selected-open {
    padding: 12px;
    border-radius: 12px 12px 0 0;
  }

  .icon {
    transition: transform 0.3s ease;
  }

  .options-header {
    font-weight: 700;
    font-size: 18px;
    color: #8a8fa4;
  }

  .option-wrapper {
    margin-top: 10px;
  }
</style>
