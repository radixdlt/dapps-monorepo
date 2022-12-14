<script>
  import { TabPanel } from '@rgossiaux/svelte-headlessui'
  import { css } from '@styles'

  const tabPanelClass = css({
    py: '$md'
  })
</script>

<TabPanel class={tabPanelClass()}>
  <slot />
</TabPanel>
