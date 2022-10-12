<script lang="ts">
  import Button from '@components/_base/button/Button.svelte'
  import { css } from '@styles'

  export let name: string = ''
  export let filetypes: string[] = ['.*']
  export let onFileSelected: (file: File) => void

  let fileInput: HTMLInputElement

  const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement
    const files = target.files
    if (!files) {
      // TODO display error message
      return
    }
    const file = files[0]
    onFileSelected(file)
  }

  const fileInputStyle = css({
    display: 'none'
  })()
</script>

<Button on:click={fileInput.click}>
  <slot />
</Button>

<input
  class={fileInputStyle}
  {name}
  multiple={false}
  type="file"
  accept={filetypes.join(',')}
  on:change={handleFileUpload}
  bind:this={fileInput}
/>
