<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import PillsMenu from './PillsMenu.svelte'
</script>

<Meta title="Base components / Pills menu" />

<Template>
  <PillsMenu
    active="token"
    onClick={(id) => console.log(`clicked: ${id}`)}
    items={[
      [
        { id: 'token', label: 'Tokens' },
        { id: 'ntfs', label: 'NFTs' },
        { id: 'pool-units', label: 'Pool Units' }
      ],
      [
        { id: 'recent-transactions', label: 'Recent Transactions' },
        { id: 'Metadata', label: 'Metadata' }
      ]
    ]}
  />
</Template>

<Story name="Primary" />
