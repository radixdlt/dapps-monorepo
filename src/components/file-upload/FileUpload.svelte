<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  // @ts-ignore no type definitions available
  import FileUpload, { registerPlugin } from 'svelte-filepond'
  import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
  import { getFileExtension } from '@utils'

  registerPlugin(FilePondPluginFileValidateType)
  const name = 'fileupload'

  const handleAddFile = (_: Error, { file }: { file: File }) => {
    if (onAddFile && file) {
      onAddFile(file)
    }
  }

  export let acceptedFileTypes: string[] | undefined = undefined
  export let onAddFile: (file: File) => void
  export let labelIdle =
    "Drop the files or <span class='filepond--label-action'>Browse</span>"

  const validation = (source: File) => {
    const type = getFileExtension(source.name)
    return new Promise((resolve, reject) => {
      if (acceptedFileTypes?.includes(type)) {
        resolve(type)
      } else {
        reject(type)
      }
    })
  }
</script>

<Box transparent>
  <FileUpload
    {name}
    fileValidateTypeDetectType={validation}
    allowMultiple={true}
    {acceptedFileTypes}
    onaddfile={handleAddFile}
    credits={false}
    {labelIdle}
  />
</Box>

<style global>
  @import 'filepond/dist/filepond.css';
</style>
