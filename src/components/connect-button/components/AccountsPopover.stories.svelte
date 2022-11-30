<script>
  import { action } from '@storybook/addon-actions'

  import { Meta, Story } from '@storybook/addon-svelte-csf'

  import AccountsPopover from './AccountsPopover.svelte'

  const dummyData = [
    {
      label: 'Account 1',
      address: '0x123456789',
      appearanceId: 0
    },
    {
      label: 'Account 2',
      address: '0x123456787',
      appearanceId: 1
    },
    {
      label: 'Account 3',
      address: '0x123456788',
      appearanceId: 2
    }
  ]
</script>

<Meta title="AccountsPopover" component={AccountsPopover} />

<Story name="Primary">
  <AccountsPopover
    forceShow
    onSelect={action('onSelect')}
    selected={dummyData[0]}
    accounts={dummyData}
  />
</Story>
