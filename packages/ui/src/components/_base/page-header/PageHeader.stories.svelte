<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import PageHeader from './PageHeader.svelte'
</script>

<Meta title="Base components / Page header" />

<Template>
  <PageHeader
    address="account_tdx_21_129pwk68z20ylwhawglf2z9x926ywsmyye5yykc0d9aprxmq8vkjrrm"
    onMenuClick={(id) => {
      console.log(id)
    }}
    menuItems={[[{ id: 'tokens', label: 'Tokens' }]]}
    activeTab="tokens">Account</PageHeader>
</Template>

<Story name="Primary" />
