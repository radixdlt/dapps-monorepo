<script lang="ts">
  import Checkbox from '@components/_base/checkbox/Checkbox.svelte'

  export let isDappDefinition: boolean
  export let isChecked: boolean

  const options = [
    {
      label: 'Select this checkbox to configure your account as a dApp',
      checked: false
    }
  ]

  let selected: {}[] = []

  $: options[0]!.checked = isDappDefinition

  $: isChecked = selected.length > 0
</script>

<Checkbox {options} bind:selected />
