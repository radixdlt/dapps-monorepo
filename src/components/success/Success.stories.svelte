<script lang="ts">
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf'
  import Success from './Success.svelte'
</script>

<Meta title="Success" component={Success} />

<Template>
  <Success title="Test success screen!" />
</Template>

<Story name="Primary" />
