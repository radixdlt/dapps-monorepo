<script lang="ts">
  import { accounts, type Account } from '@stores'
  import { shortenAddress } from '@utils'

  import IconNew from '@components/_base/icon/IconNew.svelte'
  import Picker from '../Picker.svelte'

  export let selected: Account
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
>
  <button
    slot="selected"
    class="selected option gradient-{selected?.appearanceId ?? 'empty'}"
  >
    <span class="label">{selected?.label || 'Not selected'}</span>
    <div class="icon-wrapper">
      <span class="address">{shortenAddress(selected?.address || '')}</span>
      <div class="icon" style:transform={`rotate(${open ? '180deg' : 0})`}>
        <IconNew type="accountPickerExpand" size="small" />
      </div>
    </div>
  </button>

  <div slot="option" class="option-wrapper" let:option>
    <button class="option gradient-{option.value.appearanceId}">
      <span class="label">{option.label}</span>
      <span class="address">{shortenAddress(option?.value.address || '')}</span>
    </button>
  </div>
</Picker>

<style lang="scss">
  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
  }

  .icon {
    transition: transform 0.3s ease;
    margin-left: 10px;
  }

  .address {
    color: #fff;
    opacity: 0.8;
  }

  .label {
    font-weight: var(--font-weight-bold-2);
  }
  .option {
    color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    box-sizing: border-box;
    border-radius: 12px;
    height: 50px;
    width: 100%;
  }

  .option-wrapper {
    padding-top: 10px;
  }
  .gradient-empty {
    background: linear-gradient(276.58deg, #c9c9c9 -0.6%, #636363 102.8%);
  }
  .gradient-0 {
    background: linear-gradient(276.58deg, #01e2a0 -0.6%, #052cc0 102.8%);
  }
  .gradient-1 {
    background: linear-gradient(276.33deg, #ff43ca -14.55%, #052cc0 102.71%);
  }
  .gradient-2 {
    background: linear-gradient(276.33deg, #20e4ff -14.55%, #052cc0 102.71%);
  }
  .gradient-3 {
    background: linear-gradient(94.8deg, #00ab84 -1.2%, #052cc0 103.67%);
  }
  .gradient-4 {
    background: linear-gradient(94.62deg, #ce0d98 -10.14%, #052cc0 104.1%);
  }
  .gradient-5 {
    background: linear-gradient(276.33deg, #052cc0 -14.55%, #0dcae4 102.71%);
  }
  .gradient-6 {
    background: linear-gradient(90.89deg, #003057 -2.21%, #03d597 102.16%);
  }
  .gradient-7 {
    background: linear-gradient(276.23deg, #f31dbe -2.1%, #003057 102.67%);
  }
  .gradient-8 {
    background: linear-gradient(276.48deg, #003057 -0.14%, #052cc0 102.77%);
  }
  .gradient-9 {
    background: linear-gradient(276.32deg, #1af4b5 -5.15%, #0ba97d 102.7%);
  }
  .gradient-10 {
    background: linear-gradient(276.23deg, #e225b3 -2.1%, #7e0d5f 102.67%);
  }
  .gradient-11 {
    background: linear-gradient(276.48deg, #1f48e2 -0.14%, #040b72 102.77%);
  }
</style>
