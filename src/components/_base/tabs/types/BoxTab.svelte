<script lang="ts" context="module">
  export const TAB_HEIGHT = '40px'
</script>

<script lang="ts">
  import { Tab } from '@rgossiaux/svelte-headlessui'
  import { css } from '@styles'

  const selectedTab = css({
    color: '$primary'
  })()

  const tab = css({
    marginRight: '10px',
    backgroundColor: '$surface',
    border: 'none',
    cursor: 'pointer'
  })()
</script>

<Tab class={({ selected }) => `${tab} ${selected ? selectedTab : ''}`}>
  <slot />
</Tab>
