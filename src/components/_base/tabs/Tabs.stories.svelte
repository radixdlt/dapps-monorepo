<script lang="ts">
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf'
  import Tabs from './Tabs.svelte'

  const tabs = [
    { name: 'One of my accounts', content: 'content1' },
    { name: 'Other account', content: 'content2' }
  ]
</script>

<Meta title="Tabs" component={Tabs} />

<Template>
  <Tabs {tabs} />
</Template>

<Story name="Primary" />
