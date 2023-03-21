<script lang="ts">
  import Checkbox from '@components/_base/checkbox/Checkbox.svelte'

  export let isDappDefinition: boolean
  export let isChecked: boolean

  let options = [
    {
      label: 'This account is a DApp definition',
      checked: false
    }
  ]

  let selected: {}[] = []

  $: options[0]!.checked = isDappDefinition

  $: options[0]!.checked = isChecked

  $: {
    options[0]!.checked
    options = [...options]
  }

  $: isChecked = selected.length > 0
</script>

<Checkbox bind:options bind:selected />
