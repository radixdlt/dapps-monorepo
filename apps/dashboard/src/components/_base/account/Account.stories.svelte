<script lang="ts">
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import Account from './Account.svelte'
  import IconNew from '../icon/IconNew.svelte'
  const accounts = [
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
    },
    {
      label: "Wife's Holdings",
      appearanceId: 4,
      address:
        'account_tdx_22_128eksrhxcm5chjwkaz5y4srveqzxgal96fj6u7hg9pj978c8h4x7jw',
      displayed: ''
    },
    {
      label: 'For the future',
      appearanceId: 5,
      address:
        'account_tdx_22_128eksrhxcm5chjwkaz5y4srveqzxgal96fj6u7hg9pj978c8h4x7jw',
      displayed: ''
    }
  ]
</script>

<Meta title="Base Components / Account" />

<Story name="Primary">
  {#each accounts as account}
    <Account {account} />
  {/each}
</Story>

<Story name="With Slot">
  <Account>
    <IconNew type="accountPickerExpand" size="small" />
  </Account>
  <Account account={accounts[0]}>
    <IconNew type="accountPickerExpand" size="small" /></Account
  >
</Story>

<Story name="Empty">
  <Account />
</Story>
