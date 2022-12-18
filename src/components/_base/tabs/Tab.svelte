<script>
  import { Tab } from '@rgossiaux/svelte-headlessui'
  import { onMount } from 'svelte'

  export let _default = false

  onMount(() => {
    const inputs = document.getElementsByTagName('input')
    for (const input of inputs) {
      input.setAttribute('name', 'tag')
    }
  })
</script>

<Tab as={'input'} type="radio" checked={_default} />
