<script lang="ts">
  import CheckedList from '@components/_base/checked-list/CheckedList.svelte'

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

<CheckedList bind:options bind:selected />
