<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import { action } from '@storybook/addon-actions'
  import FileUpload from './FileUpload.svelte'
</script>

<Meta title="FileUpload" />

<Template>
  <FileUpload
    onRemoveFile={action('onRemoveFile')}
    onAddFile={action('file selected')}
  />
</Template>

<Story name="Primary" />
