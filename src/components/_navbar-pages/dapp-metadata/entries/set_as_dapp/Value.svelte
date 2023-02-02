<script lang="ts">
  import Checkbox from '@components/_base/checkbox/Checkbox.svelte'
  import { context } from '../../DappMetadata.svelte'

  const options = [
    {
      label: 'Select this checkbox to configure your account as a dApp',
      checked: false
    }
  ]

  let selected: {}[] = []

  const isDappDefinition = context.get('isDappDefinition')

  $: options[0]!.checked = $isDappDefinition

  $: context.get('asDAppDefinition')(selected.length > 0)
</script>

<Checkbox {options} bind:selected />
