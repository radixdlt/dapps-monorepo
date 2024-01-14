<script context="module">
  export const meta = {}
</script>

<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import { action } from '@storybook/addon-actions'
  import FileUpload from './FileUpload.svelte'
</script>

<Template>
  <FileUpload
    onRemoveFile={action('onRemoveFile')}
    onAddFile={action('file selected')}
    maxFiles={2}
  />
</Template>

<Story name="Primary" />
