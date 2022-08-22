<script lang="ts">
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf'
  import ConnectButton from './ConnectButton.svelte'
</script>

<Meta title="ConnectButton" component={ConnectButton} />

<Template let:args>
  <ConnectButton />
</Template>

<Story name="Primary" />
