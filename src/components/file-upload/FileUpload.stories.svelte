<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import { action } from '@storybook/addon-actions'
  import FileUpload from './FileUpload.svelte'
  const handleRemoveFile = (error, file) => {
    console.log(file.fileExtension, file)
    action('onRemoveFile')(error, file)
  }
</script>

<Meta title="FileUpload" />

<Template>
  <FileUpload
    onRemoveFile={handleRemoveFile}
    onAddFile={action('file selected')}
  />
</Template>

<Story name="Primary" />
