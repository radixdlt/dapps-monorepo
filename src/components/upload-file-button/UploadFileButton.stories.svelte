<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import UploadFileButton from './UploadFileButton.svelte'
</script>

<Meta title="UploadFileButton" />

<Template let:args>
  <UploadFileButton filetypes={args.filetypes} onFileSelected={() => {}}
    >Upload</UploadFileButton
  >
</Template>

<Story
  name="Primary"
  args={{
    filetypes: ['.*']
  }}
/>
