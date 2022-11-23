<script>
  import { Meta, Story } from '@storybook/addon-svelte-csf'

  import AccountsPopover from './AccountsPopover.svelte'

  const dummyData = [
    {
      name: 'Account 1',
      address: '0x123456789'
    },
    {
      name: 'Account 2',
      address: '0x123456787'
    },
    {
      name: 'Account 3',
      address: '0x123456788'
    }
  ]
</script>

<Meta title="AccountsPopover" component={AccountsPopover} />

<Story name="Primary">
  <AccountsPopover
    forceShow
    selected={dummyData[0].address}
    accounts={dummyData}
  />
</Story>
