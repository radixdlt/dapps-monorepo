<script lang="ts">
  import type { SvelteComponentTyped } from 'svelte/internal'

  type C = $$Generic<typeof SvelteComponentTyped<any, any, any>>

  export let component: C
  export let props: any
</script>

<svelte:component this={component} {...props} />
