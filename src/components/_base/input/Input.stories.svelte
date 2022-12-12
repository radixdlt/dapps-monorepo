<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import Input from './Input.svelte'
</script>

<Meta title="Input" component={Input} />

<Template>
  <Input placeholder="Placeholder" />
</Template>

<Story name="Primary" />
