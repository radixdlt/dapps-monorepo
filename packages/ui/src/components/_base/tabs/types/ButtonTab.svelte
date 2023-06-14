<script lang="ts">
  import { Tab } from '@rgossiaux/svelte-headlessui'
  import { css } from '@styles'

  const selectedClass = css({
    backgroundColor: '$primaryGhostButtonText',
    color: 'white'
  })()

  const tabClass = css({
    width: '140px',
    height: '50px',
    cursor: 'pointer',
    color: 'inherit',
    backgroundColor: '$transparent',
    border: '1px solid $borderColor',
    shadow: true,
    mr: '$md',
    '&:hover': {
      backgroundColor: '$primaryButton',
      color: 'white'
    }
  })()
</script>

<Tab
  class={({ selected }) =>
    selected ? tabClass + ' ' + selectedClass : tabClass}
>
  <slot />
</Tab>
