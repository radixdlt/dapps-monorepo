<script lang="ts" context="module">
  export type FileItem = { file: File; fileExtension: string }
</script>

<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  // @ts-ignore no type definitions available
  import FileUpload, { registerPlugin } from 'svelte-filepond'
  import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
  import { getFileExtension } from '@utils'

  registerPlugin(FilePondPluginFileValidateType)
  const name = 'fileupload'

  const handleAddFile = (_: Error, file: FileItem) => {
    if (onAddFile && file) {
      onAddFile(file)
    }
  }

  export let maxFiles: number
  export let acceptedFileTypes: string[] | undefined = undefined
  export let onAddFile: (file: FileItem) => void
  export let labelIdle =
    "Drop the files or <span class='filepond--label-action'>Browse</span>"

  export let onRemoveFile: (_: Error, file: FileItem) => void

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
    {maxFiles}
    {name}
    fileValidateTypeDetectType={validation}
    allowMultiple={maxFiles > 1 ? true : false}
    {acceptedFileTypes}
    onaddfile={handleAddFile}
    credits={false}
    {labelIdle}
    onremovefile={onRemoveFile}
  />
</Box>

<style global>
  @import 'filepond/dist/filepond.css';
</style>
