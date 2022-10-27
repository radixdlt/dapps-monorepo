<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  // @ts-ignore no type definitions available
  import FileUpload, { registerPlugin } from 'svelte-filepond'
  import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'

  registerPlugin(FilePondPluginFileValidateType)
  const name = 'fileupload'

  const handleAddFile = (_: Error, { file }: { file: File }) => {
    if (onAddFile && file) {
      onAddFile(file)
    }
  }

  export let acceptedFileTypes: string[] | undefined = undefined
  export let onAddFile: (file: File) => void
  export let lableIdle =
    "Drop the files or <span class='filepond--label-action'>Browse</span>"
</script>

<Box transparent>
  <FileUpload
    {name}
    allowMultiple={true}
    {acceptedFileTypes}
    onaddfile={handleAddFile}
    credits={false}
    {lableIdle}
  />
</Box>

<style>
  @import 'filepond/dist/filepond.css';
</style>
