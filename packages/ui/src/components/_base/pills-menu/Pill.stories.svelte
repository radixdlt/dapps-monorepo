<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import Pill from './Pill.svelte'
</script>

<Meta title="Base components / Pills menu / Pill" />

<Template>
  <Pill active>Tokens</Pill>
  <Pill>Nfts</Pill>
</Template>

<Story name="Primary" />
