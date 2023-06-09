<script lang="ts">
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import AccountPicker from './AccountPicker.svelte'
  import { accounts, type Account } from '@stores'

  accounts.set([
    {
      label: 'My Main Account With Very Long N',
      appearanceId: 0,
      address:
        'account_tdx_22_12xt9uxe39dxdfy9c23vn0qj7eaxs8p3fjjpkr8f48edsfvyk00ck3l',
      displayed: ''
    },
    {
      label: 'Secondary Account',
      appearanceId: 1,
      address:
        'account_tdx_22_128eksrhxcm5chjwkaz5y4mrveqzxg5l96fj6u7hg9pj978c8habcee',
      displayed: ''
    },
    {
      label: 'My Business',
      appearanceId: 2,
      address:
        'account_tdx_22_128eksrhxcm5chjwkaz5y4srveqzxg5l96fj6u7hg9pj978c8h4x2ft',
      displayed: ''
    },
    {
      label: 'Private Savings',
      appearanceId: 3,
      address:
        'account_tdx_22_128eksrhxcm5chjwkaz5y4srveqzxgal96fj6u7hg9pj978c8h4x7jw',
      displayed: ''
    }
  ])

  let selected: Account
</script>

<Meta title="Base Components / Picker / AccountPicker" />

<Story name="Primary">
  <div style="background: #F4F5F9; height:100vh;padding:40px">
    <div style="width:400px">
      <AccountPicker bind:selected />
    </div>
  </div>
</Story>
